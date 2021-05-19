<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
require_once('db.inc.php');

$data = $_REQUEST;


$response = [];

$mediaFolder = '../usermedia';

$mediaURL = $_SERVER['SCRIPT_URI'];
$mediaURL = str_replace('/api','/usermedia',$mediaURL);

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$rKey = $data['key'];
$id = -1;
if(isset($data['id'])) {
    $id = $data['id'];
}
$command = $data['command'];
$payload = '';
if(isset($data['payload'])) {
    $payload = $data['payload'];
}
$key = 'testkeyp';
$ip = $_SERVER['REMOTE_ADDR'];


function base64_to_file($base64_string, $output_file) {
    // open the output file for writing
    $ifp = fopen( $output_file, 'wb' ); 

    // split the string on commas
    // $data[ 0 ] == "data:image/png;base64"
    // $data[ 1 ] == <actual base64 string>
    $data = explode( ',', $base64_string );

    // we could add validation here with ensuring count( $data ) > 1
    fwrite( $ifp, base64_decode( $data[ 1 ] ) );

    // clean up the file resource
    fclose( $ifp ); 

    return $output_file; 
}

function getallmedia($id,$conn) {
    $sq = "SELECT * FROM userMedia WHERE userID=$id ";
    if(isset($payload['mimetype'])) {
        $sq .= "AND mimetype='".$payload['mimetype']."' ";
    }
    $output = [];
    $sq .= "ORDER BY timestamp DESC";
    $result = $conn->query($sq);
    while($row = $result->fetch_array(MYSQLI_ASSOC)) {
        $output[] = [
            'url'=>$row['url'],
            'lat'=>$row['lat'],
            'lon'=>$row['lon'],
            'gpxid'=>$row['gpxid'],
            'mediaid'=>str_replace('-','#',$row['mediaid']),
            'timestamp'=>$row['timestamp'],
            'mimetype'=>$row['mimetype']
        ];
    }
    return $output;
}

function suffixFromMime($mime) {
    switch ($mime) {
        case 'text/plain':
            $suffix = 'txt';
            break;
        case 'image/jpeg':
            $suffix = 'jpg';
            break;
        case 'image/png':
            $suffix = 'png';
            break;
        case 'audio/mpeg':
            $suffix = 'mp3';
            break;
        case 'audio/mp4':
            $suffix = 'mp4';
            break;
        case 'audio/wav':
            $suffix = 'wav';
            break;
        case 'audio/webm':
            $suffix = 'webm';
            break;
        case 'audio/aac':
            $suffix = 'aac';
            break;
        default:
            $suffix = 'bin';
            break;
    }
    return $suffix;
}

if($rKey!=$key) {
    $response['result'] = 'error';
    $response['message'] = 'missing or invalid key.';
} else {
    $idV=intval($id);
    if($idV>0) {
        $sq = "SELECT userID FROM users WHERE userID=$idV LIMIT 1";
        $result = $conn->query($sq);
        if($result->num_rows==1) {
            $id = $idV; // valid, in database
        } else {
            // invalid, set back to pending 
            $id = 'pending';
        }
    }
    if($id=='pending') {
        // transparently register and transmit unique id
        $sq = "INSERT INTO users (ip) VALUES ('$ip')";
        $result = $conn->query($sq);
        $id = $conn->insert_id;
        $response['id'] = $id;
    } else {
        $response['id'] = $id;
    }
    $userPath = $mediaFolder.'/u'.$id;

    switch ($command) {
        
        case 'requestid':   
            $response['message'] = 'id successfully created.';
            $response['result'] = 'success'; 
            break;
        
        case 'error':  
            // logging remote error 
            $err = $payload['data'];
            $ua = $payload['ua'];

            $sq = "INSERT INTO errors (error,userAgent) VALUES ('".addslashes($err)."','".addslashes($ua)."')";
            $result = $conn->query($sq);

            if($result) {

                $response['message'] = 'error successfully logged.';
                $response['result'] = 'success'; 
            } else {


                $response['message'] = 'error logging error.';
                $response['result'] = 'error'; 
            }
            break;

        case 'data':

            // retrieve batch experience data

            $to = date('Y-m-d H:i:s');
            $from = date('Y-m-d');
            $limit = 10000;

            $id = 0;

            if(isset($payload['to'])) {
                $to = $payload['to'];
            }
            if(isset($payload['from'])) {
                $from = $payload['from'];
            }
            if(isset($payload['limit'])) {
                $limit = $payload['limit'];
            }
            if(isset($payload['id'])) {
                $id = $payload['id'];
            }

            $sq = "SELECT * FROM users WHERE state!='' AND ";

            if($id>0) {
                $sq .= " id=$id ";
            } else {
                $sq .= " created BETWEEN '$from' AND '$to' ";
            }

            $sq .= " ORDER BY userID DESC LIMIT $limit";

            $data = [];

            $result = $conn->query($sq);

            // print($sq);
            if($result && $result->num_rows>0) {
                
                while($row=$result->fetch_array(MYSQLI_ASSOC)) {
                    $data['user'.$row['userID']] = [];
                    $data['user'.$row['userID']]['state'] = json_decode($row['state']);
                    $data['user'.$row['userID']]['media'] = getallmedia($row['userID'],$conn);
                }


                $response['message'] = 'Data successfully retrieved.';
                $response['result'] = 'success'; 
                $response['data'] = $data;



            } else {

                $response['message'] = 'No data found within specified parameters or database error.';
                $response['result'] = 'error'; 
            }
            break;


        case 'email':  
            // logging remote error 
            
            $email = $payload['email'];

            $sq = "INSERT INTO mailingList (email) VALUES ('".addslashes($email)."')";
            $result = $conn->query($sq);

            if($result) {

                $response['message'] = 'Email successfully stored.';
                $response['result'] = 'success'; 
            } else {


                $response['message'] = 'Error storing email.';
                $response['result'] = 'error'; 
            }
            break;

        case 'feedback':  
            // logging feedback
            
            $q1 = $payload['q1'];
            $q2 = $payload['q2'];

            $sq = "INSERT INTO feedback (q1,q2) VALUES ('".addslashes($q1)."','".addslashes($q2)."')";
            $result = $conn->query($sq);

            if($result) {

                $response['message'] = 'Feedback successfully stored.';
                $response['result'] = 'success'; 
            } else {


                $response['message'] = 'Error storing feedback.';
                $response['result'] = 'error'; 
            }
            break;
        
        case 'matchtree':
            if(isset($payload['lat'])&&isset($payload['lon'])) {
                $lat = $payload['lat'];
                $lon = $payload['lon'];
                $sq = "SELECT * FROM ( SELECT *, ( ( ( acos( sin(( $lat * pi() / 180)) * sin(( `lat` * pi() / 180)) + cos(( $lat * pi() /180 )) * cos(( `lat` * pi() / 180)) * cos((( $lon - `lon`) * pi()/180))) ) * 180/pi() ) * 60 * 1.1515 * 1.609344 ) as distance FROM `trees` ) trees WHERE CommonName IS NOT NULL AND distance <= 1 ORDER BY distance ASC LIMIT 1";

                $result = $conn->query($sq);

                if($result && $result->num_rows>0) {
                    // choose at random
                    $matchID = rand(0,$result->num_rows-1);
                    $id = 0;
                    while($row=$result->fetch_array(MYSQLI_ASSOC)) {
                        if($id==$matchID) {
                            break;
                        }
                        $id++;
                    }
                    $response['message'] = 'tree match found';
                    $response['result'] = 'success';
                    foreach($row as $key=>$value) {
                        $response[$key] = $value;
                    }

                    // store the info in the user media folder
                    

                } else {
                    $response['message'] = 'no trees found within 10 kilometres of current location.';
                    $response['result'] = 'error'; 
                }
            } else {
                $response['message'] = 'missing latitude or longitude.';
                $response['result'] = 'error'; 
            }
            break;

        case 'getallmedia':
            $response['media'] = getallmedia($id,$conn);
            $response['message'] = 'media successfully retrieved';
            $response['result'] = 'success';
            break;

        case 'uploadmedia':


            if(isset($payload['mimetype']) && isset($payload['data']) && isset($payload['mediaid']) && isset($payload['lat']) && isset($payload['lon']) && isset($payload['lon'])) {
                
                if(!is_dir($userPath)) {
                    mkdir($userPath);
                }
                
                if($payload['mimetype']=='text/plain') {
                    // no decoding, just save text
                    file_put_contents($userPath.'/'.$payload['mediaid'].'.txt',$payload['data']);
                } else {
                    base64_to_file($payload['data'],$userPath.'/'.$payload['mediaid'].'.'.suffixFromMime($payload['mimetype']));
                }

                $url = $mediaURL.'u'.$id.'/'.$payload['mediaid'].'.'.suffixFromMime($payload['mimetype']);
                
                $sq = "SELECT userMediaID FROM userMedia WHERE userID=$id AND mediaid='".$payload['mediaid']."' LIMIT 1";
                $result = $conn->query($sq);
                if($result->num_rows==1) {
                    // update
                    $sq = "UPDATE userMedia SET
                        lat=".$payload['lat'].",
                        lon=".$payload['lon'].",
                        gpxid=".$payload['gpxid'].",
                        mimetype='".$payload['mimetype']."'
                    WHERE userID=$id AND mediaid='".$payload['mediaid']."' LIMIT 1";

                } else {
                    // insert
                    $sq = "INSERT INTO userMedia (userID,mediaid,url,lat,lon,mimetype,gpxid) VALUES
                            ($id,'".$payload['mediaid']."','".$url."',".$payload['lat'].",".$payload['lon'].",'".$payload['mimetype']."',".$payload['gpxid'].")";
                    
                }
                $result = $conn->query($sq);

                $response['sql'] = $sq;
                $response['url'] = $url;
                $response['message'] = 'media successfully uploaded.';
                $response['result'] = 'success';      

            } else {
                $response['message'] = 'missing mimetype, data, mediaid or coordinates.';
                $response['result'] = 'error';         
            }
            break;

        case 'mediaurl':
            $payload = json_decode($data['payload']);
            if(isset($payload->mimetype) && isset($payload->mediaid)) {
                $filePath = $userPath.'/'.$payload->mediaid.'.'.suffixFromMime($payload->mimetype);
                if(file_exists($filePath)) {
                    $response['message'] = 'file url returned.';
                    $response['url'] = $mediaURL.'u'.$id.'/'.$payload->mediaid.'.'.suffixFromMime($payload->mimetype);
                    $response['result'] = 'success';   
                    
                    $sq = "SELECT userMediaID FROM userMedia WHERE userID=$id AND mediaid='".$payload->mediaid."' LIMIT 1";
                    $result = $conn->query($sq);
                    if($result->num_rows==1) {
                        $row = $result->fetch_array(MYSQLI_ASSOC);
                        $response['lat'] = $row['lat'];
                        $response['lon'] = $row['lon'];
                        $response['timestamp'] = $row['timestamp'];
                    }

                } else {
                    $response['message'] = 'file not present.';
                    $response['result'] = 'error';     
                }

            } else {
                $response['message'] = 'missing mimetype or mediaid.';
                $response['result'] = 'error';         
            }
            break;

        case 'uploadstate':
            $payload = $data['payload'];
            if(isset($payload['state']) && $payload['state']!='') {
                $sq = "UPDATE users SET state='".$payload['state']."' WHERE userID=$id LIMIT 1";
                $result = $conn->query($sq);

                $response['result'] = 'success';
                $response['message']  = 'state successfully uploaded.';
            } else {
                $response['result'] = 'error';
                $response['message']  = 'state missing.';
            }
            
            break;

        case 'downloadstate':
            $sq = "SELECT state FROM users WHERE userID=$id LIMIT 1";
            $result = $conn->query($sq);
            $row = $result->fetch_array(MYSQLI_ASSOC);
            $response['state'] = $row['state'];

            $response['result'] = 'success';
            $response['message']  = 'state successfully downloaded.';
            break;

        default:
            $response['message'] = 'missing or invalid command: '.$command;
            $response['result'] = 'error';


    }
}


$conn->close();
print json_encode($response);
?>