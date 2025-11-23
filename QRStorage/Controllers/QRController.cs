using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QRStorage.Contexts;
using QRStorage.Models;
using QRStorage.Services;

namespace QRStorage.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QRController : ControllerBase
    {
        private readonly QRService _service;

        public QRController(QRService service)
        {
            _service = service;
        }

        // GET: api/QR
        [HttpGet]
        public async Task<ActionResult<IEnumerable<QRModel>>> GetQRModels()
        {
            return Ok(await _service.GetActiveAsync());
        }

        // GET: api/QR/5
        [HttpGet("{id}")]
        public async Task<ActionResult<QRModel>> GetQRModel(int id)
        {
            var qRModel = await _service.GetByIdAsync(id);

            if (qRModel == null)
            {
                return NotFound();
            }

            return qRModel;
        }

        // PUT: api/QR/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutQRModel(int id, QRModel qRModel)
        {
            var success = await _service.UpdateAsync(id, qRModel);
            if (!success)
                return BadRequest();

            return NoContent();
        }

        // POST: api/QR
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<QRModel>> PostQRModel([FromBody] string qrCode)
        {
            try
            {
                var qrModel = new QRModel
                {
                    qrCode = qrCode,
                    status = true,
                    createDate = DateTime.Now
                };
                var created = await _service.CreateAsync(qrModel);

                return CreatedAtAction("GetQRModel", new { id = created.id }, created);
            }
            catch (InvalidOperationException ex) 
            { 
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }      
        }

        // DELETE: api/QR/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQRModel(int id)
        {
            try
            {
                var success = await _service.SoftDeleteAsync(id);
                if (!success)
                    return NotFound(new { message = "Failed to Delete QR" });

                return NoContent();
            }
            catch (Exception ex) {
                return StatusCode(500, new { message = ex.Message });
            } 
        }
    }
}
