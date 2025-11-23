using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QRStorage.Models
{
    [Table("QRDetail")]
    public class QRModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }

        [Required]
        [MaxLength(30)]
        [Column(TypeName = "nvarchar(30)")]
        public string qrCode { get; set; } = string.Empty;

        [Required]
        public bool status { get; set; } = false;

        public DateTime? createDate { get; set; }

        public DateTime? updateDate { get; set; }
    }
}
