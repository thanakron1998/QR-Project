using Microsoft.EntityFrameworkCore;
using QRStorage.Contexts;
using QRStorage.Models;

namespace QRStorage.Services
{
    public class QRService
    {
        private readonly QRModelContext _context;

        public QRService(QRModelContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<QRModel>> GetAllAsync()
        {
            return await _context.QRModels.ToListAsync();
        }

        public async Task<IEnumerable<QRModel>> GetActiveAsync()
        {
            return await _context.QRModels.Where(e => e.status == true).ToListAsync();
        }

        public async Task<QRModel?> GetByIdAsync(int id)
        {
            return await _context.QRModels.FindAsync(id);
        }

        public async Task<bool> UpdateAsync(int id, QRModel model)
        {
            if (id != model.id)
                return false;

            _context.Entry(model).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.QRModels.Any(e => e.id == id))
                    return false;

                throw;
            }

            return true;
        }
        public async Task<QRModel> CreateAsync(QRModel model)
        {
            try
            {
                var exists = await _context.QRModels
                                   .AnyAsync(q => q.qrCode == model.qrCode);

                if (exists)
                {
                    throw new InvalidOperationException($"QRModel with code '{model.qrCode}' already exists.");
                }

                _context.QRModels.Add(model);
                await _context.SaveChangesAsync();

                return model;
            }
            catch (DbUpdateException ex) 
            {
                throw new Exception("Error saving QRModel to database", ex);
            }
        }

        public async Task<bool> SoftDeleteAsync(int id)
        {
            try
            {
                var qr = await _context.QRModels.FindAsync(id);
                if (qr == null)
                {
                    return false;
                }

                qr.status = false;
                qr.updateDate = DateTime.Now;

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception("Error Deleting QRModel", ex);
            }
        }
    }
}
