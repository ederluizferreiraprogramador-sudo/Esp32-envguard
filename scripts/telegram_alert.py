"""
EnvGuard - Bridge MQTT -> Telegram
Escuta o tópico MQTT publicado pelo ESP32 e envia alertas para o Telegram
quando algum limiar ambiental é excedido.

Requisitos: pip install paho-mqtt requests
"""

import json
import time
import requests
import paho.mqtt.client as mqtt

MQTT_BROKER = "192.168.1.100"
MQTT_PORT = 1883
MQTT_TOPIC = "envguard/sala"

TELEGRAM_BOT_TOKEN = "SEU_BOT_TOKEN_AQUI"
TELEGRAM_CHAT_ID = "SEU_CHAT_ID_AQUI"

COOLDOWN_SECONDS = 300  # evita espamar alertas repetidos
last_alert_time = 0


def send_telegram_message(text: str) -> None:
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {"chat_id": TELEGRAM_CHAT_ID, "text": text, "parse_mode": "Markdown"}
    try:
        requests.post(url, json=payload, timeout=10)
    except requests.RequestException as exc:
        print(f"[erro] Falha ao enviar Telegram: {exc}")


def on_connect(client, userdata, flags, rc):
    print(f"Conectado ao broker MQTT (rc={rc}). Assinando {MQTT_TOPIC}...")
    client.subscribe(MQTT_TOPIC)


def on_message(client, userdata, msg):
    global last_alert_time

    try:
        data = json.loads(msg.payload.decode())
    except json.JSONDecodeError:
        return

    print(f"Leitura recebida: {data}")

    if data.get("alert") and (time.time() - last_alert_time > COOLDOWN_SECONDS):
        message = (
            "⚠️ *EnvGuard - Alerta Ambiental*\n\n"
            f"🌡️ Temperatura: {data['temperature']}°C\n"
            f"💧 Umidade: {data['humidity']}%\n"
            f"🌫️ Qualidade do ar (ADC): {data['air_quality']}\n"
            f"🔊 Ruído (ADC): {data['noise_level']}\n\n"
            "Verifique o ambiente monitorado."
        )
        send_telegram_message(message)
        last_alert_time = time.time()


def main():
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect(MQTT_BROKER, MQTT_PORT, keepalive=60)
    client.loop_forever()


if __name__ == "__main__":
    main()
