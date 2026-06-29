import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, Event as RouterEvent } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'm3allem-front';
    showLayout = true;
    isLoadingPage = false;
    isAiPage = false;
    loadingMessage = 'جاري التحميل...';

    private loadingTimeout: any;

    constructor(private router: Router) {}

    ngOnInit(): void {
        this.router.events.subscribe((event: RouterEvent) => {
            if (event instanceof NavigationStart) {
                const targetUrl = event.url;
                this.isAiPage = targetUrl.includes('qscale') || targetUrl.includes('ai');
                this.loadingMessage = this.isAiPage ? 'جاري إعداد مساحة الذكاء الاصطناعي...' : 'جاري فتح الصفحة...';
                
                clearTimeout(this.loadingTimeout);
                this.isLoadingPage = true;
            } else if (
                event instanceof NavigationEnd ||
                event instanceof NavigationCancel ||
                event instanceof NavigationError
            ) {
                if (event instanceof NavigationEnd) {
                    const noLayout = ['/auth', '/qscale-workspace', '/test-ai'];
                    this.showLayout = !noLayout.some(path => event.urlAfterRedirects.includes(path));
                }

                // Smooth minimum loading display to avoid flashing
                clearTimeout(this.loadingTimeout);
                this.loadingTimeout = setTimeout(() => {
                    this.isLoadingPage = false;
                }, 450);
            }
        });
    }
}
