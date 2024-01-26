import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationStart, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

//The type of headerdata.
type HeaderData = {
    title?: string;
    biggerBanner?: boolean;
    search?: boolean;
    colour?: string;
};

@Injectable({
    providedIn: 'root'
})

/**
 * @class HeaderService is a simple Angular service dedicated to changing the look of the header depending on the webpage.
 * @author Marcus K.
 */
export class HeaderService {


    //The default header template it falls back on when none is provided.
    private headerTemplate: HeaderData = {
        title: '',
        biggerBanner: false,
        search: false,
        colour: '#456ed8'
    };

    private searchQuery = ''

    private dataBehaviourSubjectHeader: BehaviorSubject<HeaderData> =
        new BehaviorSubject<HeaderData>(this.headerTemplate);

        private dataBehaviourSubjectSearch: BehaviorSubject<string> =
        new BehaviorSubject<string>(this.searchQuery);

    //Makes the outgoing headerdata an observable so it can be listened to for updates.
    private headerData = this.dataBehaviourSubjectHeader.asObservable();

    //A function to set the new header data
    public assignHeaderData(headerData: HeaderData) {
        this.titleService.setTitle( headerData.title + " | Het Vrolijke Avontuur" );
        this.dataBehaviourSubjectHeader.next(headerData);
    }

    //A function to retrieve header related data
    public getHeaderData(): Observable<HeaderData> {
        const returnValue = this.headerData;
        return returnValue;
    }

    public assignQueryData(searchQuery: string) {
        this.dataBehaviourSubjectSearch.next(searchQuery);
    }

    private queryData = this.dataBehaviourSubjectSearch.asObservable();

    public getSearchQuery(): Observable<string> {
        const returnValue = this.queryData;
        return returnValue;
    }

    //Essentially clears the header data to it's default upon navigation, so it's not sticky when going to a page with no data provided
    constructor(private router: Router, private titleService: Title) {
        this.router.events.subscribe(val => {
            if (val instanceof NavigationStart) {
                this.assignHeaderData(this.headerTemplate);
            }
        });
    }
}
