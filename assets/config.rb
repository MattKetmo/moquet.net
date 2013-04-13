http_path       = "/assets/"

css_dir         = "css"
sass_dir        = "scss"
fonts_dir       = "fonts"
images_dir      = "images"
javascripts_dir = "javascripts"

line_comments = (environment == :production) ? false : true
output_style  = (environment == :production) ? :compressed : :nested
