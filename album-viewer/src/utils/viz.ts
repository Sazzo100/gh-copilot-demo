// generate a plot with D3.js of the selling price of the album by year
// x-axis are the month series and y-axis show the numbers of albums sold
// data from the sales of album are loaded in from an external source and are in json format
import * as d3 from "d3";

export interface AlbumSalesData {
    month: string;
    sales: number;
}

export function createAlbumSalesPlot(data: AlbumSalesData[]): d3.Selection<SVGGElement, unknown, HTMLElement, any> {
    // Set the dimensions and margins of the graph
    const margin = { top: 20, right: 30, bottom: 40, left: 40 },
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // Clear any existing chart
    d3.select("#album-sales-plot").selectAll("*").remove();

    // Append the svg object to the body of the page
    const svg = d3
        .select("#album-sales-plot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create the scales for the x and y axis
    const xScale = d3
        .scaleBand()
        .range([0, width])
        .domain(data.map((d) => d.month))
        .padding(0.2);

    svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Add Y axis
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => d.sales) || 0])
        .range([height, 0]);

    svg.append("g").call(d3.axisLeft(yScale));

    // Bars
    svg
        .selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d) => xScale(d.month) || 0)
        .attr("y", (d) => yScale(d.sales))
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => height - yScale(d.sales))
        .attr("fill", "#69b3a2");

    // Add labels
    svg
        .selectAll("mylabels")
        .data(data)
        .enter()
        .append("text")
        .text((d) => d.sales.toString())
        .attr("x", (d) => (xScale(d.month) || 0) + xScale.bandwidth() / 2)
        .attr("y", (d) => yScale(d.sales) - 5)
        .attr("text-anchor", "middle")
        .style("fill", "black");

    // Add title
    svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Album Sales by Month");

    // Add x-axis label
    svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 5)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Month");

    // Add y-axis label
    svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 15)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Sales");

    return svg;
}

// Function to load data from JSON file and create chart
export async function loadAndCreateChart(): Promise<void> {
    try {
        const data = await d3.json<AlbumSalesData[]>("/data/album-sales.json");
        if (data) {
            createAlbumSalesPlot(data);
        }
    } catch (error) {
        console.error("Error loading album sales data:", error);
    }
}
