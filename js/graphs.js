import { formatXP } from "./cards.js";

function formattedDate(date) {
    const d = new Date(date);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
}

function createXpGraphElement(xpTransactions) {
    const graphs = document.getElementById("graphs")
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", 650);
    svg.setAttribute("height", 400);
    svg.setAttribute("viewBox", "0 0 650 400");
    graphs.appendChild(svg);

    const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
    title.setAttribute("x", 250);
    title.setAttribute("y", 30);
    title.setAttribute("font-size", "18");
    title.setAttribute("fill", "black");
    title.textContent = "XP Progress Over Time"; 
    svg.appendChild(title);

    const lineX = document.createElementNS("http://www.w3.org/2000/svg", "line");
    lineX.setAttribute("x1", 30);
    lineX.setAttribute("y1", 350);
    lineX.setAttribute("x2", 600);
    lineX.setAttribute("y2", 350);
    lineX.setAttribute("stroke", "black");
    svg.appendChild(lineX);

    const lineY = document.createElementNS("http://www.w3.org/2000/svg", "line");
    lineY.setAttribute("x1", 30);
    lineY.setAttribute("y1", 50);
    lineY.setAttribute("x2", 30);
    lineY.setAttribute("y2", 350);
    lineY.setAttribute("stroke", "black");
    svg.appendChild(lineY);

    const textX = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textX.setAttribute("x", 300);
    textX.setAttribute("y", 370);
    textX.setAttribute("fill", "black");
    textX.textContent = "Date";
    svg.appendChild(textX);

    const textY = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textY.setAttribute("x", 20);
    textY.setAttribute("y", 250);
    textY.setAttribute("fill", "black");
    textY.setAttribute("transform", "rotate(-90 20,250)");
    textY.textContent = "Xp Amount";
    svg.appendChild(textY);


    let cumulativeAmount = 0;
    xpTransactions.forEach(point => {
        cumulativeAmount += point.amount;
    });

    const yScale = 300 / cumulativeAmount;
    const timeSpan = new Date(xpTransactions[xpTransactions.length - 1].createdAt).getTime() - new Date(xpTransactions[0].createdAt).getTime();
    const xScale = 550 / timeSpan;

    let lasty = 350;
    let points = "";

    xpTransactions.forEach(point => {
        const timeOffset = new Date(point.createdAt).getTime() - new Date(xpTransactions[0].createdAt).getTime();
        const x = 30 + timeOffset * xScale;
        const y = lasty - point.amount * yScale;
        points += `${x},${lasty} ${x},${y} `;
        lasty = y;
    });

    const timeOffset = new Date().getTime() - new Date(xpTransactions[0].createdAt).getTime();
    const x = 30 + timeOffset * xScale;
    points += `${x},${lasty} `;

    const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    polyline.setAttribute("fill", "none");
    polyline.setAttribute("stroke", "#444cf7");
    polyline.setAttribute("points", points);
    svg.appendChild(polyline);

    lasty = 350;
    xpTransactions.forEach(point => {
        const timeOffset = new Date(point.createdAt).getTime() - new Date(xpTransactions[0].createdAt).getTime();
        const x = 30 + timeOffset * xScale;
        const y = lasty - point.amount * yScale;
        lasty = y;

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", 2);
        circle.setAttribute("fill", "#444cf7");

        const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        title.textContent = `${point.object.name}\n${formatXP(point.amount)}\n${formattedDate(point.createdAt)}`;
        circle.appendChild(title);

        svg.appendChild(circle);
    });
}

function createSkillsGraphElement(skillTransactions) {
    const graphs = document.getElementById("graphs")
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", 860);
    svg.setAttribute("height", 450);
    svg.setAttribute("viewBox", "0 0 850 450");
    graphs.appendChild(svg);

    const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
    title.setAttribute("x", 370);
    title.setAttribute("y", 30);
    title.setAttribute("font-size", "18");
    title.setAttribute("fill", "black");
    title.textContent = "Skills Progress";
    svg.appendChild(title);

    skillTransactions.forEach((t, index) => {
        const x = index * 50 + 45;
        const barHeight = (t.amount / 100) * 300;
        const y = 400 - barHeight - 50;

        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        rect.setAttribute("width", 30);
        rect.setAttribute("height", barHeight);
        rect.setAttribute("fill", "steelblue");
        svg.appendChild(rect);

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", x + 7);
        text.setAttribute("y", 360);
        text.setAttribute("transform", `rotate(45, ${x}, ${360})`);
        text.textContent = t.type.split('_')[1];
        svg.appendChild(text);

        const amountText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        amountText.setAttribute("x", x + 3);
        amountText.setAttribute("y", y - 5);
        amountText.textContent = `${t.amount}%`;
        svg.appendChild(amountText);
    });

    const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    xAxis.setAttribute("x1", 45);
    xAxis.setAttribute("y1", 350);
    xAxis.setAttribute("x2", 830);
    xAxis.setAttribute("y2", 350);
    xAxis.setAttribute("stroke", "black");
    xAxis.setAttribute("stroke-width", "2");
    svg.appendChild(xAxis);

    const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    yAxis.setAttribute("x1", 45);
    yAxis.setAttribute("y1", 50);
    yAxis.setAttribute("x2", 45);
    yAxis.setAttribute("y2", 350);
    yAxis.setAttribute("stroke", "black");
    yAxis.setAttribute("stroke-width", "2");
    svg.appendChild(yAxis);



    for (let i = 0; i <= 100; i += 10) {
        const yPosition = 350 - (i / 100) * 300;

        const yLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        yLabel.setAttribute("x", 35);
        yLabel.setAttribute("y", yPosition + 5);
        yLabel.setAttribute("text-anchor", "end");
        yLabel.setAttribute("font-size", "14");
        yLabel.textContent = `${i}%`;
        svg.appendChild(yLabel);

        const yTick = document.createElementNS("http://www.w3.org/2000/svg", "line");
        yTick.setAttribute("x1", 40);
        yTick.setAttribute("y1", yPosition);
        yTick.setAttribute("x2", 45);
        yTick.setAttribute("y2", yPosition);
        yTick.setAttribute("stroke", "black");
        yTick.setAttribute("stroke-width", "2");
        svg.appendChild(yTick);
    }

}



export function createGraphElement(xpTransactions, skillsTransactions) {
    let div = document.createElement("div")
    div.id = "graphs"
    app.append(div)
    
    createSkillsGraphElement(skillsTransactions)
    createXpGraphElement(xpTransactions)

}