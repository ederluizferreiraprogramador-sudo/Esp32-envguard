# 🌡️ EnvGuard — Estação de Monitoramento Ambiental com ESP32

Monitor de ambiente open-source que mede **temperatura, umidade, qualidade do ar e ruído**, exibe tudo em um dashboard web em tempo real e envia **alertas via MQTT/Telegram** quando algo sai do normal.

Ideal para: home office, sala de servidores, quarto de bebê, estufa, escritório ou qualquer ambiente que você queira monitorar remotamente.

![status](https://img.shields.io/badge/status-ativo-brightgreen)
![platform](https://img.shields.io/badge/platform-ESP32-blue)
![license](https://img.shields.io/badge/license-MIT-lightgrey)

## ✨ Funcionalidades

- 📡 Leitura contínua de temperatura, umidade (DHT22), qualidade do ar (MQ-135) e nível de ruído (KY-038)
- 🌐 Dashboard web responsivo com gráfico histórico (Chart.js), servido pelo próprio ESP32
- 📨 Publicação de dados via MQTT (compatível com Home Assistant, Node-RED, InfluxCB, etc.)
- 🔔 Alertas automáticos via Telegram quando limiares são excedidos
- 💡 LED indicador de alerta local
- 🔧 Totalmente configurável (limiares, intervalo de leitura, tópicos)

## 🧰 Hardware necessário

| Componente | Função | Custo aprox. |
|---|---|---|
| ESP32 DevKit | Microcontrolador + WiFi | R$ 30–40 |
| DHT22 | Temperatura e umidade | R$ 15–25 |
| MQ-135 | Qualidade do ar / gases | R$ 12–20 |
| KY-038 | Sensor de som | R$ 8–15 |
| LED + resistor 220Ω | Indicador visual de alerta | R$ 1 |
| Protoboard + jumpers | Montagem | R$ 15 |

**Total estimado: ~R$ 90–120**

### Esquema de ligação

```
DHT22   -> GPIO 4
MQ-135  -> GPIO 34 (ADC)
KY-038  -> GPIO 35 (ADC)
LED     -> GPIO 2 (+ resistor para GND)
```

## 🚀 Como usar

### 1. Firmware (ESP32)

1. Abra `firmware/envguard.ino` na Arduino IDE ou PlatformIO
2. Instale as bibliotecas: `DHT sensor library`, `ArduinoJson`, `PubSubClient`
3. Edite as credenciais no topo do arquivo (WiFi e broker MQTT)
4. Faça o upload para o ESP32
5. Abra o Monitor Serial para ver o IP atribuído

### 2. Dashboard

Acesse `http://<IP_DO_ESP32>/` no navegador — o dashboard em `dashboard/index.html` é servido automaticamente e atualiza os dados a cada 5 segundos via `/api/data`.

Também é possível hospedar o `dashboard/index.html` separadamente (ex: GitHub Pages) e apontar `ESP32_HOST` no script para o IP do dispositivo.

### 3. Alertas via Telegram (opcional)

1. Crie um bot no [@BotFather](https://t.me/BotFather) e obtenha o token
2. Descubra seu `chat_id` conversando com [@userinfobot](https://t.me/userinfobot)
3. Configure `scripts/telegram_alert.py` com token, chat_id e IP do broker MQTT
4. Instale as dependências e rode o script num Raspberry Pi, servidor ou seu próprio computador:

```bash
pip install paho-mqtt requests
python scripts/telegram_alert.py
```

Esse script se conecta ao mesmo broker MQTT do ESP32 e dispara mensagens automaticamente quando qualquer sensor excede o limiar configurado.

## 📊 Arquitetura

```
[ESP32 + Sensores] --WiFi--> [Dashboard Web local]
        |
        └--MQTT--> [Broker (Mosquitto/HA)] --> [Node-RED / InfluxDB / Grafana]
                                            └--> [Bridge Telegram (Python)]
```

## 🗺️ Roadmap

- [ ] Persistência de histórico local (SQLite/LittleFS)
- [ ] Suporte a múltiplos sensores CO2 (SCD30/MH-Z19 para leitura real em ppm)
- [ ] Modo AP de configuração inicial (WiFiManager)
- [ ] Integração nativa com Home Assistant (auto-discovery MQTT)
- [ ] App mobile via PWA

## 📄 Licença

MIT — use, modifique e distribua livremente.

---

Feito com ☕ e um ESP32 rodando 24/7 monitorando o quarto do bebê.
