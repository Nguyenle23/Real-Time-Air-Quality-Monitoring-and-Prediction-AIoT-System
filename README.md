> The bachelor's project for my graduation

# Introduction
<h3> AIAir - Realtime Air Quality Monitoring and Forecasting System using Fog Computing Technology </h3>

<h4>Member</h4>

| ID | Name | 
| ----- | --------- |
| ITITIU19169 | [Lê Nguyễn Bình Nguyên](https://github.com/Nguyenle23) | 

<h4>Motivation</h4>
<ol>
  <li>AIAir is an air quality monitoring system that uses AIoT technology to monitor the air quality in your home or office.</li>
  <li>AIAir is developed by AIoTLabVN, a student from the International University, Vietnam National University Ho Chi Minh City.</li>
  <li>AIAir is the bachelor's thesis of student: Le Nguyen Binh Nguyen with supervisor Dr. Le Duy Tan.</li>
</ol>

<h4>Present slides: <a href=https://www.canva.com/design/DAF7i1xX47c/IyQZU9MTtVMhfnwKaPM-rQ/edit> here </a> </h4>

<h4>Video demo: https://youtu.be/NBvkcnzNGVQ</h4>

<h4>Deployment: https://www.aiair-aiotlabvn.tech/</h4>

<h2 id="table-of-contents"> :book: Table of Contents</h2>
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#general-information">General Information</a></li>
    <li>
      <a href="#setup">Setup Tutorial</a>
       <ul>
        <li><a href="https://github.com/Nguyenle23/AIAir-Quality-System/edit/main/aiair-server/README.md">Aiair-server</a></li>
        <li><a href="https://github.com/Nguyenle23/AIAir-Quality-System/edit/main/client/README.md">Client</a></li>
        <li><a href="https://github.com/Nguyenle23/AIAir-Quality-System/edit/main/microcontroller/README.md">Microcontroller</a></li>
        <li><a href="https://github.com/Nguyenle23/AIAir-Quality-System/edit/main/mobile/README.md">Mobile</a></li>
        <li><a href="https://github.com/Nguyenle23/AIAir-Quality-System/edit/main/zmp/README.md">Zalo Mini Platform</a></li>
        <li><a href="https://github.com/Nguyenle23/AIAir-Quality-System/edit/main/server/README.md">Server</a></li>
       </ul>
    </li>
    <li><a href="#folder-structure">Folder Structure</a></li>
  </ol>
</details>

<h2 id="general-information"> 🧮 General Information</h2>

- **AIAir-Server** : The folder for deploying server for <a href=https://www.aiair-aiotlabvn.tech/>AIAir Website<a/>
- **Client** : The client for the user, built with ReactJS, Openstreetmap, and the HighCharts plugin.
- **Microcontroller** : The folder for storing code to upload on hardware devices.
- **Mobile** : The mobile interface for the user, using Flutter framework, Openstreetmap, and the Syncfusion.
- **ZMP** : The Zalo Mini App platform provided by Zalo with ReactJS.
- **Server** : The server is using the Flask framework, integrating with a variety of models and algorithms.

<h2 id="setup"> 🧰 Setup</h2>
<ul>
      <li><a href="https://github.com/Nguyenle23/AIAir-Quality-System/tree/main/aiair-server">Aiair-server</a></li>
      <li><a href="https://github.com/Nguyenle23/AIAir-Quality-System/edit/main/client">Client</a></li>
      <li><a href="https://github.com/Nguyenle23/AIAir-Quality-System/edit/main/microcontroller">Microcontroller</a></li>
      <li><a href="https://github.com/Nguyenle23/AIAir-Quality-System/edit/main/mobile">Mobile</a></li>
      <li><a href="https://github.com/Nguyenle23/AIAir-Quality-System/edit/main/zmp">Zalo Mini Platform</a></li>
      <li><a href="https://github.com/Nguyenle23/AIAir-Quality-System/edit/main/server">Server</a></li>
</ul>

<h2 id="folder-structure"> 🗺️ Folder Structure</h2>

    ├── aiair-server
    │   ├── controllers
    │   ├── datasets/models
    │   ├── routes
    │   ├── app.py
    │   
    ├── client
    │   ├── public
    │   ├── src
    │   │   ├── apis
    │   │   ├── assets
    │   │   ├── components
    │   │   ├── constants
    │   │   ├── contexts
    │   │   ├── data
    │   │   ├── utils
    │   │   ├── App.jsx
    │   │   ├── main.jsx
    │   
    ├── microcontroller
    │   ├── Arduino MKR 1010
    │   ├── Arduino Uno R3
    │   ├── STM32F429ZIT6
    │   
    ├── server
    │   ├── controllers
    │   ├── datasets
    │   ├── routes
    │   ├── app.py
    │   
    ├── zmp
    │   ├── .vscode
    │   ├── assets-src
    │   ├── src
    │   │   ├── apis
    │   │   ├── components
    │   │   ├── constants
    │   │   ├── css
    │   │   ├── data
    │   │   ├── pages
    │   │   ├── static
    │   │   ├── utils
    │   │   ├── app.js
