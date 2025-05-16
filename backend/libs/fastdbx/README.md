# FastDBX - simple database extension

## Installation

### Build

```bash
pip install setuptools wheel build
python -m build --wheel
```

### Install into your project

```bash
cd workingdirectory
pip install {path_to_fastdbx_dist}/fastdbx-{version}-py3-none-any.whl
```

## User guide

### Configuration

* It looks for a settings module to take in it's minimal configuration, the settings module is taken from an environment variable 
called FASTAPI_SETTINGS_MODULE, if not set it will look for a settings.py at the root of where you run your project. The configuration
is passed as a python dictionary called FASTDBX

#### Example env variable

```bash
set FASTAPI_SETTINGS_MODULE=myproject.settings
```


#### Example configuration
```python
FASTDBX = {
    "ENGINE": {
        "URL": "{sqlalchemy_database_url}",
        "ECHO": "{True | False}",
    },
    "CREATE_TABLES": "{True | False}"
}
```

### Define an ORM model

* You can define the models with sqlalchemy, the lib just provides the DeclarativeBase out of the box, you can use it by
importing BaseEntity from fastdbx

#### Example

```python
# models.py

from fastdbx.core.model import BaseEntity
from sqlalchemy import Column, Integer, String

class Model(BaseEntity):
    __abstract__ = True
    
    id: int = Column(Integer, primary_key=True)
    

class Item(Model):
    __tablename__ = "item"
    
    name: str = Column(String)
```

### Define a repository:

* You can extend from CrudRepository, it uses a database session out of the box, no need for passing one to the repository
* You also have built in methods for:
  * finding an entity by id: **find_by_id(id)**
  * retrieving all entities: **find_all()**
  * create or update: 
    * **save(instance)** -> will result in an insert
    * **save(instance, instance_attribute1=val1, instance_attribute2=val2, ..., instance_attributeN=valN)** -> will result in an update
      * to perform the update the fields to update must be passed as keyword arguments, if they are not attributes of the instance then
      an AttributeError is raised
  * delete an entity: **delete_by_id(id)** -> return True if the record was deleted else False
* To make a custom query, you can use sqlalchemy just as before, making use of the **Session** object managed by the FastDbx

#### Example

```python
from fastdbx.core.repo import CrudRepository
from sqlalchemy import select

class ItemRepository(CrudRepository[Item]):
    def __init__(self):
        super().__init__(Item)

    def find_by_name_startswith(self, prefix: str) -> list[Item]:
        statement = select(self.entity).where(self.entity.name.startswith(name))
        return self.session.scalars(statement).all()

```

### Entering a transactional context

The library manages the Session object of SQLAlchemy and provides it into your repository class on it's own, but there needs to be 
a transactional context, to achieve this, you can decorate the method in which you wish to make your data access operation using **@transactional**

**Note**: without entering a transactional context, it will result into a runtime error.

#### Example

```python
from fastdbx.transactions.meta import transactional

_repo = ItemRepository()

@transactional()
def get_items_who_start_with_prefix(prefix: str) -> list[Item]:
  return repo.find_by_name_startsith(prefix)

```

The library takes care of beginning a new transaction, executing your queries inside that transaction and commit them on success or perform a rollback
if an exception occurs. By default it rollbacks if any Exception was raised, but you can define on what types of Exception to perform a rollback

Providing a tuple containing the exception types

### Example
```python

class ItemNameNotValidException(Exception):
  pass


class EntityNotFoundException(Exception):
  pass


def is_item_name_valid(name: str) -> bool:
  return len(name) < 10


@transactional(rollback_for=(ItemNameNotValidException, EntityNotFoundException))
def update_item_names(data: tuple[int, str]) -> list[Item]:
  updated_items = []
  
  for item_id, item_name in data:
    if not is_item_name_valid(item_name):
      raise ItemNameNotValidException(f"Given name: {item_name} is not valid, won't update anything...")
    
    item_to_update = _repo.find_by_id(id=item_id)

    if item_to_update is None:
      raise EntityNotFoundException(f"Item with id: {item_id} does not exist, won't update anything...")
    
    updated_item = _repo.save(item_to_update, name=item_name)
    updated_items.append(updated_item)

```

You can also define it by passing just one type of exception, if that is the only one expected

```python

@transactional(rollback_for=EntityNotFoundException)
def delete_item_by_ids(ids: int) -> None:
  for id in ids:
    is_deleted = _repo.delete_by_id(id)
    
    if not is_deleted:
      raise EntityNotFoundException(f"Item with id: {id} does not exist, won't delete anything...")
```

**NOTE** Nested transactions are not supported, so the following will not work

```python

@transactional()
def transactional_method():
  pass

@transactional()
def nested_transactional():
  transactional_method()

```
