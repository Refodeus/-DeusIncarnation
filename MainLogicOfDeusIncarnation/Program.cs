using MainLogicOfDeusIncarnation;
using Microsoft.EntityFrameworkCore;

//инициализация и конфигурация веб-приложения
var builder = WebApplication.CreateBuilder(args);

//подключение к бд
builder.Services.AddDbContext<AppDbContext>(options => 
options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
//добавление поддержки веб-компонентов рейзор
builder.Services.AddRazorPages();

//сборка веб-приложения
var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var movies = await context.Movies.ToListAsync();
    foreach (var movie in movies)
    {
        Console.WriteLine(movie.title);
    }
}


if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseEndpoints(endpoints =>
{
	endpoints.MapControllerRoute(name: "default", pattern: "{controller=ControllerRouting}/{action=Index}/{id?}");
});

app.UseAuthorization();

app.MapRazorPages();

app.Run();
