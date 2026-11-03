# IEEE-Style Report: API-Based Currency Converter

## Abstract
This paper presents the design and implementation of an API-based currency converter as a full-stack web application. The system integrates a responsive frontend with a Python Flask backend to collect user input, call a live exchange-rate API, and display the converted amount. The proposed solution demonstrates real-time data exchange, modular software architecture, and practical web development concepts suitable for B.Tech academic projects and viva presentation.

## 1. Introduction
Currency conversion is a common requirement in online financial applications. Traditional manual conversion methods are slow and error-prone. The rapid growth of web technologies and public APIs has enabled the development of efficient online currency converters that deliver real-time results. This project addresses the need for a lightweight, user-friendly, and scalable converter application.

## 2. Objectives
The main objectives of the project are:
- To develop a full-stack web application for currency conversion.
- To connect the backend with a live exchange-rate API.
- To provide a user-friendly interface for entering amounts and selecting currencies.
- To display accurate conversion results and error messages.
- To present the system as a professional academic project for review and viva.

## 3. Literature Review
Several online currency converter systems are available, but many depend on static exchange-rate data or require complex frameworks. Recent systems increasingly use REST APIs to provide real-time exchange rates. The proposed project adopts a simple and effective approach by combining a Flask backend with a live API, making it suitable for educational purposes and easy to understand during demonstration.

## 4. Proposed Methodology
The application follows a client-server architecture. The frontend is implemented using HTML, CSS, and JavaScript, while the backend is developed in Python using Flask. The user enters an amount and selects the source and target currencies. The frontend sends a request to the backend, which calls the Frankfurter exchange-rate API. The backend receives the response, performs processing, and sends the converted result back to the frontend in JSON format.

## 5. System Architecture
The system consists of three main components:
1. Frontend interface for user interaction.
2. Backend service for handling requests and business logic.
3. External exchange-rate API for live currency information.

The architecture is modular and supports future extension with authentication, database storage, or additional financial services.

## 6. Implementation Details
The frontend provides:
- Input fields for amount and currency selection.
- Buttons for conversion.
- Dynamic display of results and messages.

The backend provides:
- A REST endpoint for conversion requests.
- Error handling for invalid inputs.
- JSON response formatting for the frontend.

## 7. Results and Discussion
The developed system successfully converts currencies using live exchange-rate data. The application displays the converted amount and exchange rate in real time. The modular structure and simple design make the project easy to explain during viva and practical to demonstrate.

## 8. Conclusion
The API-based currency converter project demonstrates the integration of web technologies, REST API communication, and backend processing. It is an effective academic project that combines usability, real-world data integration, and clean system design.

## 9. References
- Flask Documentation
- Frankfurter API Documentation
- Python Requests Library Documentation
- HTML, CSS, and JavaScript Web Standards
