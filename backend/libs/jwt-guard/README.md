# Jwt-Guard

## Overview

Offers a fast way to set up JWT Auth to a FastAPI app, 
the lib reads its configuration dynamically from a settings module and exposes out-of-the-box endpoints for obtaining a jwt token, verifying a token

## Installation

### Build

```bash
pip install setuptools wheel build
python -m build --wheel
```

### Install into your project

```bash
cd workingdirectory
pip install {path_to_jwtguard_dist}/jwt_guard-{version}-py3-none-any.whl
```

## Configuring Jwt-Guard

The package looks for the settings module from the **FASTAPI_SETTINGS_MODULE**
environment variable, if not set the package will assume the settings module is found at the **root** of your project. To configure
Jwt-Guard you must create a dictionary called **JWT_GUARD**

---
### Configuring the model

In order for Jwt-Guard to create a token for your user, you must provide information about where your user class is situated, and minimal information about
how to fetch the user from the database when trying to obtain a token. This configuration looks like this:

```python
JWT_GUARD = {
    "MODEL": {
        "CLASSPATH": str,
        "USERNAME_FIELD": str,
        "PASSWORD_FIELD": str
    }
}
```

#### CLASSPATH [Required]
* Represents the location of the your user model in your code.Jwt-Guard will try to import the model so it can the necessary database lookups
An ImproperlyConfiguredException is thrown if the model can't be found.

#### USERNAME_FIELD [Required]
* Represents the field used for the database lookup when trying to obtain a token. It must be a valid attribute of the User model, an
ImproperlyConfiguredException is thrown otherwise

#### PASSWORD_FIELD [Optional]
* Represents the field used to compare the password hashes. an ImproperlyConfiguredException is thrown if the field is not a valid field of your User model.
* Only BCrypt is support for checking password hashes

---
### Configuring the JWT produced

```python

from datetime import timedelta

JWT_GUARD = {
    "JWT": {
        "SECRET_KEY": str,
        "ALGORITHM": str,
        "TOKEN_LIFETIME": timedelta,
        "claims": tuple[str, ...]
    }
}
```

#### SECRET_KEY [Required]
* Represents the secret key to sign the jwt

#### ALGORITHM [Optional]
* Represents the algorithm used. Default HS256

#### TOKEN_LIFETIME [Optional]
* Represents the period in which an issued token is valid. Default 1 Day

#### Claims [Optional]
* Represents additional claims to add into the jwt payload. Default ()
* Only claims that can be taken from the user trying to obtain a token are supported, that means that the tuple must contain
strings representing valid attributes of your user model
* If not set, only the expiration time will be put into the payload under the claim **exp**

---
### Configuring OpenAPI [Optional]

You can configure the OpenAPI specification by adding custom tags, the default tags are **'jwt-guard'**.

```python
JWT_GUARD = {
    "OPEN_API": {
        "TAGS": list[str, ...]
    }
}
```

## Usage

---
### Enabling endpoints

You just need to add the router from Jwt-Guard to your FastAPI app.

```python
from fastapi import FastAPI
from jwt_guard.api.routers import jwt_guard_router

app = FastAPI()

app.include_router(jwt_guard_router)

```
This gives you endpoints for obtaining (**/token**) and verifying a token (**/token/verify**), visible in the OpenAPI docs under the tags provided.
You can add your own prefix for the endpoints by using the **prefix** keyword argument from the include_router method of FastAPI


### Enabling route protections

Jwt-Guard provides out of the box route protection by exposing the JwtBearer object which can be used as a dependency in your router or endpoint.
JWTBearer will check for the "'Authorization': 'Bearer' {token}" header,and try to validate the token, if not valid the request will end in a 401 UNAUTHORIZED with the detail message
containing info about why the token is not valid, also JWTBearer will inject the claims of the jwt into the current request object for usage if needed. 



```python
from fastapi import FastAPI, Depends, Request
from jwt_guard.security.auth_bearer import JWTBearer

app = FastAPI()

@app.get("/protected", dependencies=[Depends(JWTBearer())])
def protected_route(request: Request):
    pass
```

**Note**: To access let's say the claim with the name **cool_claim** you would do something like this:

```python
cool_claim = request.state.auth.cool_claim 
```

Notice the way the claim is accessed, like a regular object, not like a dictionary 

You can also give a keyword argument to the JWTBearer called **authorize** and feed it with a predicate. The predicate need to take in as argument a dictionary
(the claims dictionary from the decoded token), and perform the validation logic inside the predicate


```python
from fastapi import FastAPI, Depends, Request
from jwt_guard.security.auth_bearer import JWTBearer
from typing import Any

app = FastAPI()

class IsUserOfTypeAdmin:
    
    def __cal__(self, claims: dict[str, Any]) -> bool:
        role = claims.get("role", None)
        return role is not None and role == "admin"
        
@app.get("/protected/admin", dependencies=[Depends(JWTBearer(authorize=IsUserOfTypeAdmin))])
def protected_route(request: Request):
    pass
```


