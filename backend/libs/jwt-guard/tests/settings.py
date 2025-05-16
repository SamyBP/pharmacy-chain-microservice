FASTDBX = {
    "ENGINE": {
        "URL": "sqlite:///tests/test.db",
        "ECHO": True
    },
    "CREATE_TABLES": True
}

JWT_GUARD = {
    "MODEL": {
        "CLASSPATH": "tests.core.User",
        "USERNAME_FIELD": "email",
        "PASSWORD_FIELD": "password",
    },
    "JWT": {
        "SECRET_KEY": 'EU8qKGIoxUtlN1Mr5CofZLiASTDKDRgy',
        "CLAIMS": ('id', 'role')
    }
}

LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "detailed": {"format": "%(levelname)s %(asctime)s: \t%(threadName)s\t%(name)s:\t%(message)s"}
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "level": "DEBUG",
            "formatter": "detailed",
        }
    },
    "loggers": {"": {"handlers": ["console"], "level": "DEBUG", "propagate": True}},
}


