# Tuesday

Team COMP3900-M10B-Banana

[GitHub Repository](https://github.com/unsw-cse-comp3900-9900-22T3/capstone-project-comp3900-m10b-banana)

## Description

Tuesday is a modern task management system that takes productivity to the next level.
It allows users (task masters) to add team members and create tasks seamlessly.
Unlike other task management systems, our built-in self-reflection system provides daily analytical feedback and personalised suggestions for accelerated task improvements.
Furthermore, our state of the art priority algorithm provides a ordered list of tasks to do next so users can avoid struggling to meet deadlines.

## Repo Structure

    .
    ├── backend
        ├── common
        ├── database
        ├── helpers
        ├── plots
        ├── routes
        ├── app.py
        └── ...
    ├── frontend
        ├── public
        ├── src
            ├── components
            ├── helper
            ├── pages
            ├── App.jsx
            └── ...
        └── ...
    ├── minutes
    ├── work-diaries
    ├── .gitignore
    ├── backend_script.sh
    ├── frontend_script.sh
    ├── README.md
    ├── requirements.txt
    └── shellscript.sh

## Setup

The VMWare Workstation 16 Player option was used to run this project. Lubuntu 20.4.1 LTS was used
as per the instructions on WebCMS. Upon cloning the repo, the entire setup of the project can be
done by changing into the root directory of the project and running:

```sh 
bash shellscript.sh
```

If prompted with a display manager popup, press the escape key on the keyboard. Once
Chromium is installed, make it the default web browser from the browser settings. It is important to
test the product in Chromium specifically as certain frontend libraries are not compatible with other
browsers. Once the script is done executing, everything should have been installed in order to make product work. 
Close any terminals that are still open and run the “bash
shellscript.sh” command again. This will launch the frontend as well as the backend. 

After installation from the script, the backend and frontend can also be run separately by using these commands from the root folder:

```sh
python3 -m backend.app
cd frontend
npm start
```


## Team Members

Frontend: [Eric Dai](https://github.com/EricccD567), [Vanessa Xia](https://github.com/nessa6)

Backend: [Kevin Hu](https://github.com/AnonymousAlligator), [Luke Simmonds](https://github.com/LukeSimmonds), [Taimoor Shabih](https://github.com/tshabih13)
