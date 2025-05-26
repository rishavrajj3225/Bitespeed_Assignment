# POST /identify Endpoint Documentation

## Description
The `POST /identify` endpoint is used to identify a user based on their email and/or phone number. It handles identity linkage and maintains consistency by associating multiple contacts as either primary or secondary based on their attributes.

---

## Request
### Method
`POST`

### Endpoint
`/identify`

### Request Headers
- `Content-Type: application/json`

### Request Body
The body should be in raw JSON format and include the user's email and/or phone number.

```json
{
    "email": "user@example.com",
    "phoneNumber": "9999999999"
}

```
// created by postman



## To test the backend 

### 1. Open Postman or use curl in terminal.
### 2. Send a POST request to:

URL = https://bitespeed-assignment-ary0.onrender.com/identify

### Add raw JSON body:
```json
{
  "email": "rishuraj@gmail.com",
  "phoneNumber": "8888888888"
}
```
### sample output type
```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["rishuraj@gmail.com"],
    "phoneNumbers": ["8888888888"],
    "secondaryContactIds": [2, 3]
  }
}

```


