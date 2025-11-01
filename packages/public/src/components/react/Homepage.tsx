import { Navigation } from "@/components/ui/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Wheat, Leaf, Cake, Clock, Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background via-secondary/20 to-accent/10 py-20 md:py-32">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance">
              Свежая выпечка из натуральных ингредиентов
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty">
              Каждый день мы создаем вкусные хлебобулочные изделия и торты на заказ с любовью и заботой о качестве
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-base">
                <a href="/cakes">Посмотреть меню</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base bg-transparent">
                <a href="/contact">Заказать торт</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-12">Почему выбирают нас</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Wheat className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold">Свежая выпечка</h3>
                  <p className="text-muted-foreground text-sm">Выпекаем каждый день свежие хлебобулочные изделия</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Leaf className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold">Натуральные ингредиенты</h3>
                  <p className="text-muted-foreground text-sm">Используем только качественные и натуральные продукты</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Cake className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold">Торты на заказ</h3>
                  <p className="text-muted-foreground text-sm">Создаем уникальные торты для ваших особых событий</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold">Быстрая доставка</h3>
                  <p className="text-muted-foreground text-sm">Доставляем заказы в удобное для вас время</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-12">Контакты</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Телефон</h3>
                      <p className="text-muted-foreground">+7 (XXX) XXX-XX-XX</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-muted-foreground">info@bakery.ru</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Адрес</h3>
                      <p className="text-muted-foreground">
                        г. Москва, ул. Примерная, д. 1<br />
                        Пн-Вс: 8:00 - 20:00
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="h-[400px] rounded-lg overflow-hidden border border-border">
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Карта</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-serif text-xl font-bold mb-4">Пекарня</h3>
              <p className="text-muted-foreground text-sm">Свежая выпечка из натуральных ингредиентов каждый день</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Навигация</h4>
              <nav className="flex flex-col gap-2">
                <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Главная
                </a>
                <a href="/cakes" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Торты
                </a>
                <a href="/gallery" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Галерея
                </a>
                <a href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Контакты
                </a>
              </nav>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Социальные сети</h4>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Пекарня. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
