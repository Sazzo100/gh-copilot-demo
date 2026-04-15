using Microsoft.AspNetCore.Mvc;
using level_2_asp_net.Models;

namespace level_2_asp_net.Controllers
{
    public class ProductsController : Controller
    {
        public IActionResult Index()
        {
            // Sample data - in a real app, this would come from a database
            var products = new List<Product>
            {
                new Product { Id = 1, Name = "Laptop", Description = "High-performance laptop", Price = 999.99m, Category = "Electronics", InStock = true },
                new Product { Id = 2, Name = "Smartphone", Description = "Latest model smartphone", Price = 699.99m, Category = "Electronics", InStock = true },
                new Product { Id = 3, Name = "Desk Chair", Description = "Ergonomic office chair", Price = 299.99m, Category = "Furniture", InStock = false }
            };

            return View(products);
        }

        public IActionResult Details(int id)
        {
            // Sample product data - in a real app, this would come from a database
            var product = new Product 
            { 
                Id = id, 
                Name = "Sample Product", 
                Description = "This is a sample product", 
                Price = 99.99m, 
                Category = "Sample", 
                InStock = true 
            };

            return View(product);
        }
    }
}