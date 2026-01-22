class ReportsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def revenue
    data = ProxyCachedReportService.operational_efficiency_report

    render json: data
  end

  def masters
    start_date = params[:start_date].present? ?
      Date.parse(params[:start_date]) :
      1.month.ago.to_date

    end_date = params[:end_date].present? ?
      Date.parse(params[:end_date]) :
      Date.today

    data = ProxyCachedReportService.master_efficiency_report(start_date, end_date)

    render json: data
  end

  def clients
    data = ProxyCachedReportService.client_analytics_report

    render json: data
  end
end
