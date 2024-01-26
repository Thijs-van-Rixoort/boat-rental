import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

export type TabData = { title?: string; colour?: string }[];

@Injectable({
    providedIn: 'root'
})

/**
 * A service for cross-communication about tabs for the admin panel between components.
 * @author Marcus K.
 */
export class TabService {
    //The default tab template it falls back on when none is provided.
    private tabTemplate: TabData = [
        {
            title: undefined,
            colour: '#456ed8'
        }
    ];

    //Temporarily stores data for tabs to be loaded in by other components.
    private dataBehaviourSubjectTab: BehaviorSubject<TabData> =
        new BehaviorSubject<TabData>(this.tabTemplate);

    //Makes the outgoing tab an observable so it can be listened to for updates.
    private tabData: Observable<TabData> =
        this.dataBehaviourSubjectTab.asObservable();

    //A function to set the new tab data
    public assignTabData(tabData: TabData): void {
        this.dataBehaviourSubjectTab.next(tabData);
    }

    //A function to retrieve tab related data
    public getTabData(): Observable<TabData> {
        const returnValue: Observable<TabData> = this.tabData;
        return returnValue;
    }
}
