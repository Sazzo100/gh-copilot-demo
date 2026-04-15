# ASP.NET Core 9.0 MVC Web Application

A modern web application built with ASP.NET Core 9.0 MVC framework, featuring three main views: Index, Users, and Products.

## Features

- **Home Page**: Landing page with navigation
- **Users Management**: View and manage system users
- **Products Catalog**: Browse and manage product inventory
- **Responsive Design**: Bootstrap-based UI that works on all devices
- **Clean Architecture**: Following MVC design patterns

## Project Structure

```
├── Controllers/
│   ├── HomeController.cs       # Main application controller
│   ├── UsersController.cs      # User management controller
│   └── ProductsController.cs   # Product catalog controller
├── Models/
│   ├── User.cs                 # User data model
│   ├── Product.cs              # Product data model
│   └── ErrorViewModel.cs       # Error handling model
├── Views/
│   ├── Home/                   # Home page views
│   ├── Users/                  # User management views
│   ├── Products/               # Product catalog views
│   └── Shared/                 # Shared layout and components
├── wwwroot/                    # Static files (CSS, JS, images)
└── Program.cs                  # Application entry point
```

## Getting Started

### Prerequisites

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- Visual Studio Code or Visual Studio 2022

### Installation & Setup

1. Clone or download the project
2. Navigate to the project directory
3. Restore dependencies:
   ```bash
   dotnet restore
   ```
4. Build the project:
   ```bash
   dotnet build
   ```

### Running the Application

1. Start the development server:
   ```bash
   dotnet run
   ```
2. Open your browser and navigate to `https://localhost:5001` or `http://localhost:5000`
3. Explore the three main sections:
   - **Home**: Application dashboard and navigation
   - **Users**: User management interface
   - **Products**: Product catalog interface

### Available Commands

| Command | Description |
|---------|-------------|
| `dotnet build` | Build the project |
| `dotnet run` | Start the development server |
| `dotnet test` | Run unit tests |
| `dotnet watch run` | Start with auto-reload on file changes |

## Development Guidelines

- **Controllers**: Handle HTTP requests and coordinate between models and views
- **Models**: Define data structures and business logic
- **Views**: Implement user interface using Razor syntax
- **Follow MVC patterns**: Maintain separation of concerns
- **Use Bootstrap**: For responsive and consistent styling

## Technology Stack

- **Framework**: ASP.NET Core 9.0 MVC
- **Language**: C#
- **Frontend**: HTML5, CSS3, Bootstrap 5, JavaScript
- **Development**: .NET CLI, Visual Studio Code

## Future Enhancements

- Add Entity Framework Core for database integration
- Implement user authentication and authorization
- Add CRUD operations for Users and Products
- Include unit testing with xUnit
- API endpoints for mobile app integration
- Docker containerization

## License

This project is for educational and demonstration purposes.