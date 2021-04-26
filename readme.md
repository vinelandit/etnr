# The New Real/Edinbugrh Science Festival 2021 Web App

Codebase for ETNR/ESF 2021 interactive web app.

## Notes

Currently in alpha testing.

App is an ambulatory experience to run on mobile devices with GPS, accelerometer, audio recording and camera functionalities.

The experience consists of multiple stages of undirected walking, followed by one or more prompts to interact and to consume and/or produce data.

## Client-side code

The experience structure mentioned above is reflected in the client-side JavaScript code:

App class
|
|--Currently active stage (Stage class)
   |
   |-- Currently active prompt (Prompt_XXXX class extending the base Prompt class)

The bulk of the interactivity is handled by the Prompt classes, but there is a chain of callbacks so that the Stage instance is notified when the next prompt should be displayed, and the App instance is notified when the next stage should be displayed.

At present, stages and prompts are predefined in App->initState(), but there are plans to have the structure generated on-the-fly in future. 

## Custom prompt subclasses

See the existing /js/prompt-base.js and subclasses like /js/prompt-recordAudio.js for examples of structure and required behaviour. To add a new subclass, place its class definition in the /js/ folder and load it via a new script tag in /index.html. Finally, add a new case to the switch block in Stage->showPrompt() (/js/stage.js).

## Libraries

JS libraries currently in use by the core App class and Prompt subclasses are in /js/libs and currently consist of jQuery, matter.js and NoSleep.js.

## Server-side code (PHP/MySQL)

The /api/ folder contains a PHP/MySQL mini-API with which the client app communicates to upload user-generated media, store the (anonymous) GPS data for a completed experience, and download media for use in a restored session. It also includes a pre-processed database of trees extracted from [Edinburgh Council's online database](https://data.edinburghcouncilmaps.info/datasets/4dfc8f18a40346009b9fc32cbee34039_39). 

The structure and data for the pre-processed trees database, and the structure for the users and userMedia tables, are found in /api/rayadmin_etnr.sql.

The users table stores (in JSON format) all pertinent (anonymous) data from the users' experiences, for future use in aggregate data sculpture.

The userMedia table stores metadata about media uploaded by users via the web app. The media themselves are stored in the /api/usermedia subfolder, for which PHP should have full file create/write and folder create privileges.

Excluded from this repo for security is the file /api/db.inc.php which should contain MySQL access credentials in the form

```php
$servername = "IP or localhost";
$username = "xxxxxxx";
$password = "xxxxxx";
$dbname = "xxxxxxx";

## Contributing
Feel free to open issues.

## License
TBC