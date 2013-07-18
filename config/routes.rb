Integrated::Application.routes.draw do

  root :to => "home#index"
  get "/countries/:step/:offset" => "home#countries"

  # for the advanced exercise
  get "/country/:id" => "home#country"

end
