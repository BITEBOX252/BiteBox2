# Backend and database setup
- ## Install Python

Ensure you have Python installed (>= 3.8). If not, download and install it from Python's official site https://www.python.org/ftp/python/3.13.2/python-3.13.2-amd64.exe

- ## Set up a virtual environment:

```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # Mac/Linux
    venv\Scripts\activate    # Windows
```
## Note:
**For running any python related or django related(backend) command makesure the virtual environment is activated if not activate it first by using venv\Scripts\activate then write the python or django commands.**


- ## Install Required Packages:

Inside the virtual environment, install dependencies:

```bash
    venv\Scripts\activate
    pip install -r requirements.txt
```

- ## Install PostgreSQL Database
    - Download and install PostgreSQL from PostgreSQL's official site https://sbp.enterprisedb.com/getfile.jsp?fileid=1259337
    - During the setup in select components step check all the boxes.
    - In setup password phase enter password and remeber it because it will be used later to interact with postgresql. 
    - After setup is done at last step do not check the stack builder option(that is optional) just uncheck and click finish to install postgresql.
   
- ## Creating the Database via pgAdmin4:
    - Install the pgadmin from the https://ftp.postgresql.org/pub/pgadmin/pgadmin4/v9.0/windows/pgadmin4-9.0-x64.exe if not installed at the posgresql installation time.
    - Open pgAdmin 4 from start menu and connect to your PostgreSQL server enter the password you created at the time of postgresql installation.
    - Right-click on Databases → Click Create → Database.
    - Enter Bitebox as the database name.
    - Right click on Bitebox database go to properties.
    - Go to the Owner field and select Bitebox.
    - Click Save.
    - Navigate to Login/Group Roles in the sidebar at last → Right-click Create → Login/Group Role.
    - Enter Bitebox as the role name and set the password to Bitebox.
    - Under the Privileges tab, grant all permissions.
    - Click Save.

- ## Apply Migrations
Run migrations:
```bash
    venv\Scripts\activate 
    python manage.py makemigrations
    python manage.py migrate
```

- ## Run the Django Server
```bash
    venv\Scripts\activate 
    python manage.py runserver
```

# Frontend Setup (React)

- ## Install Node.js
Ensure you have Node.js (>= 14.x) installed. Download from Node.js official site https://nodejs.org/dist/v22.13.1/node-v22.13.1-x64.msi

- ## Install React and Dependencies
Navigate to the frontend/ folder and install dependencies:
```bash
    cd frontend
    npm install
```

- ## Run the React App
Start the development server
```bash
    npm start
```



    