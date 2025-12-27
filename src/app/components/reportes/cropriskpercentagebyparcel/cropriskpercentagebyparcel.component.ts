import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RiskPercentageByParcel } from '../../../models/riskpercentagebyparcel';
import { CropService } from '../../../services/crop.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-cropriskpercentagebyparcel',
  standalone: true,
  imports: [CommonModule, NgIf, MatTableModule, MatCardModule, MatIconModule],
  templateUrl: './cropriskpercentagebyparcel.component.html',
  styleUrl: './cropriskpercentagebyparcel.component.css'
})
export class CropriskpercentagebyparcelComponent {
  riskData: RiskPercentageByParcel[] = [];
  loading = true;
  error = '';
  private currentUserId: number | null = null;

  displayedColumns = ['idParcel', 'parcelName', 'totalCrops', 'cropsAtRisk', 'riskPercentage'];

  constructor(
    private cropService: CropService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.loginService.getUserId().subscribe((userId) => {
      this.currentUserId = userId;

      this.cropService.getCropRiskPercentageByParcel(this.currentUserId!).subscribe({
        next: (data) => {
          this.riskData = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'Error al obtener el reporte de riesgo por parcela';
          this.loading = false;
        },
      });
    });
  }
}
