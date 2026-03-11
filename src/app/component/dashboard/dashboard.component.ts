import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { RequestHelper } from '../../helpers/RequestHelper';
import { DASHBOARDURL, GETALLTASKSURL } from '../../Utility/ServiceConstant';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

hoveredTasks: any[] = [];
hoveredStatus = '';

  dashboard = {
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0
  };

  tasks: any[] = [];

  constructor(
    private requestHelper: RequestHelper,
    private toastr: ToastrService
  ) {}

  taskChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [0,0]
      }
    ]
  };

  // Bar chart
taskBarChart: ChartConfiguration<'bar'>['data'] = {
  labels: ['Completed', 'Pending', 'Overdue', 'High Priority'],
  datasets: [
    {
      label: 'Tasks',
      data: [0, 0, 0, 0]
    }
  ]
};

  ngOnInit(): void {
    this.loadDashboardStats();
    this.loadTasks();
  }


  /* ---------------- Tooltip Options ---------------- */

 chartOptions: ChartConfiguration<'doughnut'>['options'] = {
  plugins: {
    tooltip: {
      callbacks: {
        label: (context: any) => {

          const status = context.label;

          const filteredTasks = this.tasks.filter(t =>
            status === 'Completed'
              ? t.isCompleted
              : !t.isCompleted
          );

          if (filteredTasks.length === 0) {
            return `${status}: No tasks`;
          }

          // Return array -> Chart.js displays each item as new line
          return filteredTasks.map((t: any) => `• ${t.title}`);
        }
      }
    }
  }
};

  /* -------- Dashboard Numbers -------- */

  loadDashboardStats(){

    this.requestHelper.sendData('GET', DASHBOARDURL, null).subscribe({

      next:(res:any)=>{

        if(res.responseCode === 0){

          this.dashboard = res.responseDatas;

          this.taskChartData = {
            labels:['Completed','Pending'],
            datasets:[
              {
                data:[
                  this.dashboard.completedTasks,
                  this.dashboard.pendingTasks
                ]
              }
            ]
          };

        }

      },
      error:(err)=>{
        console.error(err);
      }

    });

  }

  /* -------- Tasks for Tooltip -------- */

 loadTasks(){

  const url = `${GETALLTASKSURL}?pageNumber=1&pageSize=10`;

  this.requestHelper.sendData('POST', url, null).subscribe({

    next:(res:any)=>{

      if(res.responseCode === 0){

        this.tasks = res.responseDatas;

        const completed = this.tasks.filter(t => t.isCompleted).length;

        const pending = this.tasks.filter(t => !t.isCompleted).length;

        const today = new Date();

        const overdue = this.tasks.filter(t =>
          !t.isCompleted && new Date(t.dueTime) < today
        ).length;

        const highPriority = this.tasks.filter(t => t.priority === 1).length;

        this.taskBarChart = {
          labels: ['Completed','Pending','Overdue','High Priority'],
          datasets:[
            {
              label:'Tasks',
              data:[completed,pending,overdue,highPriority]
            }
          ]
        };

      }

    },
    error:(err)=>{
      console.error(err);
    }

  });

}

}