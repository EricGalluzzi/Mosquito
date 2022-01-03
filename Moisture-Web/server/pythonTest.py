import json
import base64
import msgpack
# python3.6

import random

from paho.mqtt import client as mqtt_client


broker = '10.0.0.228'
port = 1883
topic = "helium/50529e4d-b101-461b-8170-7e7192accc1a/rx"
# generate client ID with pub prefix randomly
client_id = f'python-mqtt-{random.randint(0, 100)}'
username = 'EGall2004'
password = '4930Soccer'


def connect_mqtt() -> mqtt_client:
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT Broker!")
        else:
            print("Failed to connect, return code %d\n", rc)

    client = mqtt_client.Client(client_id)
    client.username_pw_set(username, password)
    client.on_connect = on_connect
    client.connect(broker, port)
    return client


def subscribe(client: mqtt_client):
    def on_message(client, userdata, msg):
        print(f"Received `{msg.payload.decode()}` from `{msg.topic}` topic")
        j = json.loads(msg.payload)
        b64 = base64.b64decode(j['payload'])
        mp_dict = msgpack.unpackb(b64)
        print(b64)

    client.subscribe(topic)
    client.on_message = on_message
    


def run():
    client = connect_mqtt()
    subscribe(client)
    client.loop_forever()


if __name__ == '__main__':
    run()


