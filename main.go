package main

import (
	"net/http"

	"github.com/a-h/templ"
)

func main() {
	component := home()

	fs := http.FileServer(http.Dir("files"))
	http.Handle("/files/", http.StripPrefix("/files/", fs))

	http.Handle("/", templ.Handler(component))

	http.ListenAndServe(":8080", nil)
}
