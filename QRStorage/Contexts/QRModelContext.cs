using Microsoft.EntityFrameworkCore;
using QRStorage.Models;

namespace QRStorage.Contexts
{
    public class QRModelContext:DbContext
    {
        public QRModelContext(DbContextOptions options) : base(options) 
        {

        }
        public DbSet<QRModel> QRModels { get; set; }
    }
}
