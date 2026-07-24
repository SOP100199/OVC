# OVC — Offline Video Communication

> **Connect. Communicate. Offline.**

OVC is an **offline-first, Progressive Web App (PWA)** designed to enable video and audio communication between users over a **local network without requiring Internet access**.

Built around modern web technologies such as **WebRTC**, OVC aims to provide a lightweight, private, and network-independent communication platform that can be deployed wherever Internet connectivity is unavailable, unreliable, or intentionally avoided.

---

## 🚀 Why OVC?

Most modern communication platforms depend on cloud infrastructure and Internet connectivity.

OVC takes a different approach.

**What if people could communicate using video, audio, messaging, and other services through a local network — without depending on the Internet?**

That's the idea behind OVC.

```text
                    OVC
                     │
        ┌────────────┴────────────┐
        │                         │
   Local Network             OVC PWA
        │                         │
        ▼                         ▼
  User Discovery            Local Storage
        │                         │
        ▼                         ▼
      WebRTC              Offline-first App
        │
        ▼
  Video + Audio
```

---

## ✨ Core Speciality

### 🌐 Internet-Independent Communication

OVC is designed to operate over a local network.

Users can communicate through:

* Wi-Fi
* Local hotspot networks
* Private LANs
* Dedicated OVC networks

The Internet is not required for the core communication layer.

---

### 📹 Offline Video Calling

OVC uses **WebRTC** for real-time peer-to-peer communication.

Users can:

* Make video calls
* Make voice calls
* Enable/disable camera
* Mute/unmute microphone
* Accept or reject calls
* End calls
* View connection status

The initial goal is to support reliable **1-to-1 offline video communication**.

---

### 📱 Progressive Web App

OVC is designed as a **PWA**, allowing users to install it on supported devices.

Once installed, users can access OVC like a native application while retaining the flexibility of web technologies.

The PWA architecture allows OVC to:

* Install on supported devices
* Launch as a standalone application
* Cache application resources
* Work with locally stored data
* Access supported device capabilities
* Reduce dependence on continuous Internet connectivity

---

### 💾 Local-First Data

OVC follows a **local-first architecture**.

Important user information can be stored locally using browser storage technologies such as:

* IndexedDB
* Cache API
* Web Crypto API

Potential locally stored information includes:

* OVC identity
* User profile
* Contacts
* QR identity
* Call history
* Offline messages
* Application preferences

OVC does not need to depend on a cloud database for the core offline experience.

---

### 🔳 OVC Quick Connect

OVC introduces QR-based connection and navigation.

Users can scan QR codes to quickly:

* Identify another OVC user
* Open a user's profile
* Request a video call
* Start a conversation
* Join an OVC room
* Connect to an OVC network

The goal is to make connecting to people and networks as simple as:

> **Scan → Connect → Communicate**

---

### 👤 Local User Discovery

Users connected to the same OVC network can discover other available users.

```text
OVC NETWORK

🟢 SOP
🟢 RAHUL
🟢 ARJUN
🔴 PRIYA
```

Users can see who is available and initiate communication without relying on a centralized Internet service.

---

### 🔐 Privacy-First Architecture

OVC is designed with privacy in mind.

The architecture aims to minimize unnecessary dependence on cloud infrastructure.

Possible future security mechanisms include:

* WebRTC secure communication
* Cryptographic user identities
* Local key storage
* QR-based identity exchange
* Room authentication
* Private OVC networks

Sensitive information should never be stored as plain text where secure alternatives are available.

---

## 🧩 Planned Features

### Phase 1 — Core Communication

* [ ] Local network user discovery
* [ ] 1-to-1 video calling
* [ ] Voice calling
* [ ] Microphone controls
* [ ] Camera controls
* [ ] Call accept/reject
* [ ] Call termination
* [ ] Connection status

### Phase 2 — OVC Connectivity

* [ ] OVC user identities
* [ ] QR-based user connection
* [ ] OVC Quick Connect
* [ ] Private rooms
* [ ] Local messaging
* [ ] Contact management

### Phase 3 — Advanced Communication

* [ ] Group video calls
* [ ] Screen sharing
* [ ] Offline file transfer
* [ ] Push-to-talk communication
* [ ] Local announcements
* [ ] Emergency broadcast system

### Phase 4 — Advanced OVC Network

* [ ] Portable OVC network
* [ ] Dedicated local OVC server
* [ ] Network discovery
* [ ] OVC network QR codes
* [ ] Multi-location OVC networks
* [ ] Store-and-forward messaging
* [ ] Experimental mesh communication

---

## 🏗️ Proposed Technology Stack

### Frontend

* HTML
* CSS
* JavaScript
* Progressive Web App APIs

### Real-Time Communication

* WebRTC
* WebRTC DataChannels

### Signaling

* Node.js
* Express.js
* Socket.IO / WebSocket

### Local Storage

* IndexedDB
* Cache API
* Web Crypto API

### Future Infrastructure

* Local Node.js server
* Raspberry Pi / Mini PC
* Local Wi-Fi access point

---

## 🧠 How OVC Works

A typical OVC communication flow:

```text
User installs OVC PWA
        │
        ▼
Creates OVC Identity
        │
        ▼
Identity stored locally
        │
        ▼
Connects to local network
        │
        ▼
OVC discovers available users
        │
        ▼
User selects or scans QR
        │
        ▼
Call request sent
        │
        ▼
Receiver accepts
        │
        ▼
WebRTC connection established
        │
        ▼
Video + Audio Communication
```

The local signaling layer is responsible for helping peers establish a connection, while WebRTC handles real-time media communication.

---

## 🎯 Project Vision

OVC is not intended to be another Internet-based video conferencing platform.

The vision is to build a **self-contained communication ecosystem that can function without Internet dependency**.

Potential applications include:

* Educational institutions
* Laboratories
* Offices
* Remote locations
* Disaster response
* Events
* Temporary communication networks
* Local community networks
* Emergency communication systems

---

## 🔮 Future Vision

The long-term goal of OVC is to evolve from an offline video-calling application into a broader **Offline Communication Network**.

```text
                 OVC
                  │
      ┌───────────┼───────────┐
      │           │           │
    Video       Voice       Chat
      │           │           │
      ├───────────┼───────────┤
      │           │           │
    Files       Rooms       QR
      │           │           │
      └───────────┼───────────┘
                  │
          Offline Network
                  │
          ┌───────┴───────┐
          │               │
       Local LAN      OVC Network
```

The ultimate vision is simple:

> **Communication should not always depend on the Internet.**

---

## 📌 Project Status

🚧 **OVC is currently under active development.**

The project is being developed incrementally, starting with the core offline video calling functionality and gradually expanding toward a complete offline communication ecosystem.

---

## 📄 License

OVC is proprietary software.

All rights reserved.

The source code is publicly available for viewing and reference only. Copying, modifying, redistributing, or commercially using the source code or substantial portions of the project without explicit permission from the copyright holder is not permitted.

See the `LICENSE` file for complete terms.

---

## 👨‍💻 Author

**Satyajeeth Ophir Peruka (SOP)**

---

## ⭐ OVC

**Connect. Communicate. Offline.**
