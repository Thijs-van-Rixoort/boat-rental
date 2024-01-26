import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { BoatComponent } from './pages/boat/boat.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BoatDetailsComponent } from './pages/boat-details/boat-details.component';
import { BoatCardComponent } from './components/boat-card/boat-card.component';
import { ButtonListComponent } from './components/button-list/button-list.component';
import { DashboardTabComponent } from './components/dashboard-tab/dashboard-tab.component';
import { AdminDashboardComponent } from './pages/admin-pages/admin-dashboard/admin-dashboard.component';
import { BoatManagementComponent } from './pages/admin-pages/boat-management/boat-management.component';
import { OverviewComponent } from './pages/admin-pages/overview/overview.component';
import { CreateBoatComponent } from './components/create-boat/create-boat.component';

/**
 * @author Youri Janssen //entire file
 * The root AppModule for configuring the Angular application.
 */
@NgModule({
    /**
     * The declarations array lists the components that belong to this module.
     * These components are available for use within the AppModule.
     */
    declarations: [
        AppComponent,
        RegisterComponent,
        BoatComponent,
        PageNotFoundComponent,
        HomeComponent,
        HeaderComponent,
        LoginComponent,
        BoatDetailsComponent,
        BoatCardComponent,
        ButtonListComponent,
        DashboardTabComponent,
        AdminDashboardComponent,
        BoatManagementComponent,
        OverviewComponent,
        CreateBoatComponent
    ],
    /** The imports array specifies the modules that this module depends on.*/
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        BrowserAnimationsModule,
        MatDialogModule
    ],
    /** Providers array is where you could include service providers if needed. */
    providers: [],
    /**
     * Bootstrap property specifies the root component of the application.
     * The root component is the starting point of the application's component tree.
     */
    bootstrap: [AppComponent]
})
export class AppModule {}
