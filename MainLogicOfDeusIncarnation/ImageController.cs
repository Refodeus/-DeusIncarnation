using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Drawing;
using SixLabors.Fonts;
using SixLabors.ImageSharp.Drawing.Processing;

namespace MainLogicOfDeusIncarnation
{
    public class ImageController : Controller
    {
        [HttpGet]
        public async Task<IActionResult> GenerateImage(string nickname)
        {
            int imageSize = 40;
            var backgroundColor = Color.FromRgb(37, 37, 37);
            var textColor = Color.Red;

            // Создаем новое изображение с заданным цветом фона
            using (var image = new Image<Rgba32>(imageSize, imageSize))
            {
                image.Mutate(x => x.Fill(backgroundColor));

                // Создаем путь для круговой маски
                var circlePath = new EllipsePolygon(new PointF(imageSize / 2, imageSize / 2), imageSize / 2);

                // Добавляем текст
                string firstLetter = nickname.Substring(0, 1).ToUpper();
                var font = SystemFonts.CreateFont("Arial", imageSize / 2);
                var textSize = TextMeasurer.MeasureBounds(firstLetter, new TextOptions(font));

                float xPosition = (imageSize - textSize.Width) / 2;
                float yPosition = (imageSize - textSize.Height) / 2 - 1;

                image.Mutate(x =>
                {
                    x.Fill(Color.White, circlePath);
                    x.DrawText(firstLetter, font, textColor, new PointF(xPosition, yPosition));
                });

                using (var ms = new MemoryStream())
                {
                    await image.SaveAsPngAsync(ms);
                    ms.Seek(0, SeekOrigin.Begin);
                    return File(ms.ToArray(), "image/png");
                }
            }
        }
    }
}
