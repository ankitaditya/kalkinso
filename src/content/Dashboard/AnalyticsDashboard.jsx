import React from 'react';
import { Grid, Row, Column } from '@carbon/react';
import { LineChart, PieChart, BoxplotChart, DonutChart } from '@carbon/charts-react';
import '@carbon/charts/styles.css'; // Charts styles

const dummyData = {
    salesOverTime: [
        { group: 'Sales', date: '2023-01', value: 5000 },
        { group: 'Sales', date: '2023-02', value: 7000 },
        { group: 'Sales', date: '2023-03', value: 8000 }
    ],
    userActivity: [
        { group: 'Activity', category: 'New Users', value: 200 },
        { group: 'Activity', category: 'Returning Users', value: 300 }
    ],
    conversionRate: [
        { group: 'Conversions', category: 'Converted', value: 60 },
        { group: 'Conversions', category: 'Not Converted', value: 40 }
    ],
    revenueBreakdown: [
        { group: 'Revenue', category: 'Product A', value: 4000 },
        { group: 'Revenue', category: 'Product B', value: 3000 },
        { group: 'Revenue', category: 'Product C', value: 3000 }
    ]
};

const options = {
    title: 'Chart title',
    axes: {
        bottom: { title: 'Dates', mapsTo: 'date', scaleType: 'labels' },
        left: { mapsTo: 'value', title: 'Value', scaleType: 'linear' }
    }
};

const AnalyticsDashboard = () => (
    <Grid>
        <Column lg={16} style={{margin:"2rem"}}>
        <Grid>
            <Column lg={8}>
                <LineChart data={dummyData.salesOverTime} options={{ ...options, title: 'Sales Over Time' }} />
            </Column>
            <Column lg={8}>
                <BoxplotChart data={dummyData.userActivity} options={{ ...options, title: 'User Activity', axes: { bottom: { mapsTo: 'category', scaleType: 'labels' }, left: { mapsTo: 'value', title: 'Value', scaleType: 'linear' } } }} />
            </Column>
        </Grid>
        </Column>
        <Column lg={16} style={{margin:"2rem"}}>
        <Grid>
            <Column lg={8}>
                <PieChart data={dummyData.conversionRate} options={{ title: 'Conversion Rate' }} />
            </Column>
            <Column lg={8}>
                <DonutChart data={dummyData.revenueBreakdown} options={{ title: 'Revenue Breakdown' }} />
            </Column>
        </Grid>
        </Column>
    </Grid>
);

export default AnalyticsDashboard;