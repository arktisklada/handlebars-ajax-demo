class HomeController < ApplicationController

  def index

  end

  def countries
    puts params
    step = params[:step] || 5
    offset = params[:offset] || 0
    puts offset

    countries = Country.select([:id, :abbreviation, :name, :north_america]).limit(step).offset(offset);
    
    if countries.empty?
      render :json => false
    else
      render :json => countries
    end
  end

  def country
    id = params[:id]
    country = Country.find_by_id(id);
    render :json => country
  end

end
