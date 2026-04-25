import json
import boto3

ses = boto3.client('ses')

RECIPIENT       = 'yardworkchilliwack@gmail.com'
SENDER          = 'yardworkchilliwack@gmail.com'
ALLOWED_ORIGINS = {'https://manandhismower.ca', 'https://www.manandhismower.ca'}


def lambda_handler(event, context):
    origin = (event.get('headers') or {}).get('origin', '')
    allowed_origin = origin if origin in ALLOWED_ORIGINS else 'https://manandhismower.ca'

    method = event.get('requestContext', {}).get('http', {}).get('method', '')
    if method == 'OPTIONS':
        return _response(200, '', allowed_origin)

    try:
        body = json.loads(event.get('body') or '{}')
    except ValueError:
        return _response(400, {'error': 'Invalid request body'}, allowed_origin)

    firstname = (body.get('firstname') or '').strip()
    lastname  = (body.get('lastname')  or '').strip()
    phone     = (body.get('phone')     or '').strip()
    email     = (body.get('email')     or '').strip()
    service   = (body.get('service')   or '').strip()
    message   = (body.get('message')   or '').strip()

    if not firstname or (not phone and not email):
        return _response(400, {'error': 'Name and at least one of phone/email are required'}, allowed_origin)

    subject = f"Quote request — {firstname} {lastname}".strip()
    text = (
        f"New quote request from manandhismower.ca\n"
        f"{'─' * 40}\n"
        f"Name:    {firstname} {lastname}\n"
        f"Phone:   {phone or '—'}\n"
        f"Email:   {email or '—'}\n"
        f"Service: {service or '—'}\n\n"
        f"Message:\n{message or '(none)'}\n"
    )

    try:
        ses.send_email(
            Source=SENDER,
            Destination={'ToAddresses': [RECIPIENT]},
            Message={
                'Subject': {'Data': subject, 'Charset': 'UTF-8'},
                'Body':    {'Text': {'Data': text,    'Charset': 'UTF-8'}},
            },
            ReplyToAddresses=[email] if email else [],
        )
    except Exception as e:
        print(f"SES error: {e}")
        return _response(500, {'error': 'Failed to send email — check SES configuration'}, allowed_origin)

    return _response(200, {'ok': True}, allowed_origin)


def _response(status, body, origin):
    return {
        'statusCode': status,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':  origin,
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
        },
        'body': json.dumps(body),
    }
