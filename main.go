package main

import (
	"net/http"

	"github.com/a-h/templ"
)

func main() {
	component := home()

	http.Handle("/", templ.Handler(component))

	http.ListenAndServe(":8080", nil)
}
