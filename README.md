# Student Enrollment System

A full-stack **Student Enrollment System** built using **Django REST Framework**, **React**, **PostgreSQL**, and **Docker**.  
This application allows students to securely authenticate, browse available courses, enroll and drop courses with capacity enforcement, and recover their accounts using a password reset flow.

The project is designed to reflect real-world backend and full-stack development practices, including transactional database operations and containerized deployment.

---

## 🚀 Features

### Authentication & Security
- JWT-based authentication (login / logout)
- Secure password reset using tokenized email flow
- Protected API endpoints with authentication guards
- Password validation using Django’s built-in validators

### Enrollment System
- Course listing with seat capacity limits
- Atomic enroll and drop operations
- Prevents over-enrollment under concurrent requests
- Student-specific enrollment tracking

### Full-Stack Architecture
- RESTful API built with Django REST Framework
- React frontend with Tailwind CSS
- PostgreSQL as the primary relational database
- Dockerized backend, database, and frontend services

---

## 🧱 Tech Stack

### Backend
- Python
- Django
- Django REST Framework
- PostgreSQL
- JWT Authentication (SimpleJWT)

### Frontend
- React
- Vite
- Tailwind CSS

### Infrastructure
- Docker
- Docker Compose

## 📁 Project Structure
```text
├── Dockerfile
├── README.md
├── config
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── docker-compose.yml
├── enrollment
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── auth_serializers.py
│   ├── auth_views.py
│   ├── migrations
│   ├── models.py
│   ├── password_reset_serializers.py
│   ├── password_reset_views.py
│   ├── serializers.py
│   ├── tests.py
│   ├── urls.py
│   └── views.py
├── enrollment-frontend
│   ├── Dockerfile
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   │   └── vite.svg
│   ├── src
│   │  
│   └── vite.config.js
├── manage.py
├── requirements.txt
```
## Prerequisites

*   Docker
*   Docker Compose

## Setup & Running the Application

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Parsa-Meshkini/student-enrollment-system.git
    cd student-enrollment
    ```

2.  **Create an environment file:**

    Create a `.env` file in the root of the project and add the following environment variables:

    ```
    DB_PASSWORD=your_secret_password
    SECRET_KEY=your_secret_key
    DEBUG=True
    ```

3.  **Build and run the application:**

    ```bash
    docker-compose up --build
    ```

4.  **Apply database migrations:**

    ```bash
    docker compose exec web python manage.py migrate
    ```

5.  **Create a Django superuser:**

    ```bash
    docker compose exec web python manage.py createsuperuser
    ```

## Usage

Once the application is running, you can access it at the following URLs:

| Service        | URL                                                          |
| -------------- | ------------------------------------------------------------ |
| React Frontend | [http://localhost:5173](http://localhost:5173)               |
| Django API     | [http://127.0.0.1:8000/api/](http://127.0.0.1:8000/api/)     |
| Django Admin   | [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/) |

- The frontend communicates with the backend via REST APIs.

## API Endpoints

### Authentication

*   `POST /api/auth/register/`: Register a new user.
*   `POST /api/auth/token/`: Obtain a JWT token pair (access and refresh).
*   `POST /api/auth/token/refresh/`: Refresh an access token.
*   `POST /api/auth/password-reset/`: Request a password reset.
*   `POST /api/auth/password-reset/confirm/`: Confirm a password reset.

### Application

*   `GET /api/me/`: Get the current user's details.
*   `GET /api/courses/`: Get a list of available courses.
*   `POST /api/enroll/`: Enroll in a course.
*   `POST /api/drop/`: Drop a course.
*   `GET /api/my/enrollments/`: Get the current user's enrollments.

## Environment Variables

The following environment variables are used to configure the application:

*   `DB_PASSWORD`: The password for the PostgreSQL database.
*   `SECRET_KEY`: A secret key for Django.
*   `DEBUG`: Set to `True` for development mode.
*   `CORS_ALLOWED_ORIGINS`: A comma-separated list of allowed origins for CORS.
*   `DB_NAME`: The name of the PostgreSQL database.
*   `DB_USER`: The username for the PostgreSQL database.
*   `DB_HOST`: The host of the PostgreSQL database.
*   `DB_PORT`: The port of the PostgreSQL database.
*   `ALLOWED_HOSTS`: A comma-separated list of allowed hosts for Django.

## Author

Parsa Meshkini
Computer Science Student
Full-Stack Developer

## License

This project is licensed under the MIT License.
