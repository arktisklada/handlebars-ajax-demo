class HomeController < ApplicationController

  def countries
    step = params[:step] || 5
    offset = params[:offset] || 0

    countries = Country.select([:id, :abbreviation, :name, :north_america]).limit(step).offset(offset);
    
    if countries.empty?
      render :json => false
    else
      render :json => countries
    end
  end

  # for the advanced exercise
  def country
    id = params[:id]
    country = Country.find(id);
    render :json => country
  end

end
