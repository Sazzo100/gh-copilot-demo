using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace level_2_asp_net.Models
{
    public class Product
    {
        public int Id { get; set; }
        
        [Required]
        [Display(Name = "Product Name")]
        public string Name { get; set; } = string.Empty;
        
        [Display(Name = "Description")]
        public string? Description { get; set; }
        
        [Required]
        [Display(Name = "Price")]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }
        
        [Display(Name = "Category")]
        public string? Category { get; set; }
        
        [Display(Name = "In Stock")]
        public bool InStock { get; set; } = true;
        
        [Display(Name = "Date Created")]
        public DateTime DateCreated { get; set; } = DateTime.Now;
    }
}