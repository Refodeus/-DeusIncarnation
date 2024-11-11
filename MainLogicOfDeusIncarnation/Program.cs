using MainLogicOfDeusIncarnation;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

//инициализация и конфигурация веб-приложения
var builder = WebApplication.CreateBuilder(args);

//подключение к бд
builder.Services.AddDbContext<AppDbContext>(options =>
options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

//настройка подключения к бд пользователей
builder.Services.AddDbContext<AppIdentityDbContext>(options =>
options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 5;
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.User.RequireUniqueEmail = true;
    options.SignIn.RequireConfirmedEmail = false;
}).AddRoles<IdentityRole>().AddEntityFrameworkStores<AppIdentityDbContext>();

//добавление поддержки веб-компонентов рейзор
builder.Services.AddRazorPages();

//сборка веб-приложения
var app = builder.Build();

//привязка заполнения данных для пользователей с ролями (созданных заранее пользователей)
using var scope = app.Services.GetRequiredService<IServiceScopeFactory>().CreateScope();
SeedData.EnsureSeedData(scope.ServiceProvider);

//using (var scope = app.Services.CreateScope())
//{
//    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
//    var movies = await context.Movies.ToListAsync();
//    foreach (var movie in movies)
//    {
//        Console.WriteLine(movie.year);
//    }
//}


if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
	endpoints.MapControllerRoute("default", "Login/{action=Login}/{id?}", defaults: new { controller = "Account" });
    endpoints.MapControllerRoute("main", "{controller=ControllerRouting}/{action=Index}/{id?}");
});
//app.MapGet("/", () => Results.Redirect("/Account/Login"));
app.MapRazorPages();
//app.UseStatusCodePages(context =>
//{
//	var response = context.HttpContext.Response;
//	if (response.StatusCode == 404)
//	{
//		response.Redirect("/Account/Login");
//	}
//	return Task.CompletedTask;
//});

app.Run();
