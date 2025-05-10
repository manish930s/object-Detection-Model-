# Object Detection AI Advisors

This project provides AI-powered advisors to assist users in selecting appropriate backbone and detection head architectures for real-time object detection models. It leverages the power of large language models (LLMs) to offer personalized recommendations based on user-defined requirements and constraints.

## Features

- **AI Backbone Advisor:** Recommends suitable backbone architectures for object detection based on factors like desired accuracy, inference speed, and computational resources.
- **AI Detection Head Advisor:** Suggests appropriate detection head architectures based on the chosen backbone and the characteristics of the target objects (e.g., size, number of classes).
- **Dataset Loader:** Allows users to load and analyze their own datasets to inform the advisor's recommendations.
- **Interactive Demo:** Provides a real-time object detection preview to visualize the performance of different model configurations.

## Project Details

This project aims to simplify the process of selecting optimal components for real-time object detection models. By providing AI-driven recommendations and interactive tools, it empowers users to build efficient and accurate object detection systems tailored to their specific needs. Key features include the AI Backbone Advisor, AI Detection Head Advisor, a dataset loader, and an interactive demo for real-time performance visualization.

## Technologies Used

- **Next.js:** A React framework for building server-side rendered and static web applications.
- **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs.
- **GenKit:** A framework for building AI applications.
- **Large Language Models (LLMs):** Utilized for providing intelligent recommendations.

## Getting Started

1. **Clone the repository:**
   
```bash
git clone <repository_url>
```

2. **Install dependencies:**
   
```bash
npm install
```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add the necessary environment variables for your LLM API.

4. **Run the development server:**
   
```bash
npm run dev
```

5. **Open in your browser:**
   Visit `http://localhost:3000` to access the application.

## Contributing

We welcome contributions to this project! Please see the CONTRIBUTING.md file for details on how to contribute.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
