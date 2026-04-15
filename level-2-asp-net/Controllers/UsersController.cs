using Microsoft.AspNetCore.Mvc;
using level_2_asp_net.Models;

namespace level_2_asp_net.Controllers
{
    public class UsersController : Controller
    {
        public IActionResult Index()
        {
            // Sample data - in a real app, this would come from a database
            var users = new List<User>
            {
                new User { Id = 1, FirstName = "John", LastName = "Doe", Email = "john.doe@example.com", PhoneNumber = "555-1234" },
                new User { Id = 2, FirstName = "Jane", LastName = "Smith", Email = "jane.smith@example.com", PhoneNumber = "555-5678" },
                new User { Id = 3, FirstName = "Bob", LastName = "Johnson", Email = "bob.johnson@example.com", PhoneNumber = "555-9012" }
            };

            return View(users);
        }

        public IActionResult Details(int id)
        {
            // Sample user data - in a real app, this would come from a database
            var user = new User 
            { 
                Id = id, 
                FirstName = "Sample", 
                LastName = "User", 
                Email = "sample@example.com", 
                PhoneNumber = "555-0000" 
            };

            return View(user);
        }
    }
}