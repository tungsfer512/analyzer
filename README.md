# Requirement:

    - Docker
    - Docker-compose

# GettingStarted:

- Run
  - Chmod executable file
  ```code
    chmod +x backend/entrypoint.*
  ```
  - For development

  ```text
  docker-compose up -d
  ```

  - Stop

  ```code
  docker-compose down -v
  ```

  - For production

  ```code
  docker-compose -f docker-compose.prod.yml up -d  --build
  ```

- Create user (only for the first time)

```text
docker exec -it iot-analyzer-api_backend_1 python manage.py createsuperuser
```
