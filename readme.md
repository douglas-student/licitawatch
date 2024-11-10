# LicitaWatch - Bid Monitoring [:brazil:](leiame.md)

**LicitaWatch** is an automated tool for scraping and analyzing public bidding documents, designed to monitor, extract, and process data from ongoing, completed, and suspended bids. Powered by **AWS Step Functions**, it orchestrates the entire process, from link collection to data extraction from various document formats.

## Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [How to Use](#how-to-use)
- [How to Contribute](#how-to-contribute)
- [License](#license)

## Project Description

**LicitaWatch** automates the process of monitoring public bids on municipal websites. It scrapes bid pages, checks the details, and extracts information from attached documents such as PDFs and DOCXs. After processing, it returns a JSON with the extracted data, making access and analysis easier.

The project aims to be a low-cost solution using serverless AWS services like Lambda, Step Functions, and S3, allowing for efficient and scalable execution.

## Features

- **Automated Monitoring**: Scrapes bidding websites and collects links to ongoing, completed, and suspended bids.
- **Document Processing**: Extracts information from various file formats such as PDF, DOCX, ZIP, CSV, etc.
- **Data Return**: Returns a consolidated JSON with all extracted information, such as:
  - Bid name
  - Status (ongoing, suspended, completed)
  - Bid date and location
  - Participating companies and their proposals
  - Attached documents and their contents
- **Temporary Storage**: Temporarily stores files in **S3** for processing.

## Technologies Used

- **AWS Step Functions**: Orchestrates the scraping, processing, and data return workflow.
- **AWS Lambda**: Executes individual tasks, such as scraping, downloading, and file processing.
- **AWS S3**: Temporary storage for downloaded files.
- **API Gateway**: Connects the front-end with AWS infrastructure.
- **Node.js** with libraries such as **axios**, **cheerio**, and **pdf-parse**: Used for backend data scraping and analysis.
- **HTML + JavaScript**: A simple interface to trigger the process via a web page.

## How to Use

### Prerequisites

- **AWS Account** with permissions to create and use services like Step Functions, Lambda, S3, and API Gateway.
- **Node.js** and **npm** installed locally to run the front-end.
- **AWS CLI** configured for deploying AWS resources.

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/LicitaWatch.git
   cd LicitaWatch
   ```

2. **Deploy AWS Resources**

   Follow the deployment scripts in the `infrastructure` folder to create AWS services (Step Functions, Lambda, S3, and API Gateway).

3. **Set Up Front-end**

   Inside the `frontend` folder, install dependencies and start the local server:

   ```bash
   npm install
   npm start
   ```

4. **Start the Monitoring Process**

   Access the local front-end page and click on the "Start Bid Process" button. This will trigger the Step Functions workflow, which will monitor the bids and return the JSON with the data.

## How to Contribute

1. Fork the repository
2. Create a new branch (`git checkout -b feature/new-feature`)
3. Make the necessary changes
4. Submit a pull request

## License

This project is licensed under the [MIT License](LICENSE).