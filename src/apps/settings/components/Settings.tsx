import React from 'react'
import { baseColors } from '@/lib/base-colors'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Check, Moon, Sun } from 'lucide-react'

export function Settings() {
  const { settings, setTheme, setWallpaper, toggleColorScheme } = window.linyos.useSystemStore()

  const handleWallpaperChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      setWallpaper(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="h-full w-full overflow-auto p-6 space-y-8">
      {/* Theme Settings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Theme</h2>
            <p className="text-sm text-muted-foreground">
              Customize the appearance of your system
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleColorScheme}
            className="h-8 w-8"
          >
            {settings.colorScheme === 'dark' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {baseColors.map((color) => (
            <Card
              key={color.name}
              className={`cursor-pointer transition-colors hover:bg-accent ${
                settings.theme === color.name ? 'border-primary' : ''
              }`}
              onClick={() => setTheme(color.name)}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div
                  className="h-10 w-10 rounded-full"
                  style={{
                    backgroundColor: `hsl(${
                      settings.colorScheme === 'dark'
                        ? color.activeColor.dark
                        : color.activeColor.light
                    })`,
                  }}
                />
                <div className="flex flex-1 items-center justify-between">
                  <span className="font-medium">{color.label}</span>
                  {settings.theme === color.name && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Wallpaper Settings */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Wallpaper</h2>
          <p className="text-sm text-muted-foreground">
            Choose a background image for your desktop
          </p>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="aspect-video w-full overflow-hidden rounded-lg border bg-muted">
              {settings.wallpaper ? (
                <img
                  src={settings.wallpaper}
                  alt="Current wallpaper"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="text-sm text-muted-foreground">
                    No wallpaper selected
                  </span>
                </div>
              )}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleWallpaperChange}
                className="hidden"
                id="wallpaper-input"
              />
              <Button
                onClick={() => document.getElementById('wallpaper-input')?.click()}
              >
                Choose Image
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
