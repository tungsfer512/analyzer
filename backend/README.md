# Iot Analyzer API Server

## Table of Contents

- [Requirements](#Requirements)
- [Development](#Development)


## Requirements: <a name = "Requirements"></a>

- docker
- docker-compose
## Development:<a name = "Development"></a>
- Trong thư mục, file .env.dev và .env.prod đổi lại giá trị cho 2 biến LAN_IP vaf LAN_SOCKET_SERVER_IP 
sao cho đúng với IP LOCAL của máy mình.
- find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
- find . -path "*/migrations/*.pyc"  -delete
- docker-compose up -d
- Giao diện Web API ở địa chỉ http://192.168.10.242:8008
- Scripts
    ```python
    docker-compose up -d 
    ```

    - Stop docker

    ```python
    docker-compose down
    ```

    - Rebuild docker
    ```python
    docker-compose build
    ```