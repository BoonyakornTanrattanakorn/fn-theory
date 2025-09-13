# Fn Theory

This is a web application for calculating this function:

Let F<sub>n</sub>(a, b) = #{i| i = ax+b ^ i|n} where a, b is integer and a > 1 and b >= 0

# Disclaimer

Correctness of this application is not guaranteed.

## Features

- **Function Input Form**: Enter parameters (n, a, b) to compute solutions for mathematical functions.
- **Result Display**: Shows the count of solutions and calculation time.
- **Range Selector**: Select a range for n to plot results over intervals.
- **Frequency Chart**: Visualizes frequency data for computed results.
- **Scatter Plot**: Displays solution counts across a range of n values.
- **Progress Bar**: Indicates calculation progress for large computations.
- **Algorithm Selection**: Choose between different algorithms (e.g., sieve) for computation.

## Technologies Used

- React (frontend framework)
- CanvasJS (charting library)
- JavaScript (ES6+)

## Getting Started

### Prerequisites

- Node.js (v18 or newer recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
	```sh
	git clone https://github.com/BoonyakornTanrattanakorn/fn-theory.git
	cd fn-theory
	```
2. Install dependencies:
	```sh
	npm install
	```

### Running the App

Start the development server:
```sh
npm start
```
The app will open at [http://localhost:3000](http://localhost:3000).

### Building for Production

```sh
npm run build
```
The production build will be in the `build/` directory.

### Deploying

Deploy to GitHub Pages:
```sh
npm run deploy
```

## Folder Structure

- `src/` - Source code (React components)
- `public/` - Static assets and HTML
- `build/` - Production build output

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License.
