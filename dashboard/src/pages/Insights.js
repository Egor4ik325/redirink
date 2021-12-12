import { Col, Row } from "@themesberg/react-bootstrap";
import { useEffect, useState } from "react";
import { CounterWidget, SalesValueWidget } from "../components/Widgets";
import { client } from "../api";
import { faChartPie } from "@fortawesome/free-solid-svg-icons";

function mod(n, m) {
  return ((n % m) + m) % m;
}

function Links() {
  // Fetch filtered insights data (for dashboarding)
  const [allInsights, setAllInsights] = useState(null);
  const [todayInsights, setTodayInsights] = useState(null);
  const [thisMonthInsights, setThisMonthInsights] = useState(null);
  const [previousMonthInsights, setPreviousMonthInsights] = useState(null);

  const currentTime = new Date();
  const currentDay = currentTime.getDate();
  const currentMonth = currentTime.getMonth() + 1;
  const previousMonth = mod(currentMonth - 1, 12);

  const monthIncrese =
    thisMonthInsights && previousMonthInsights
      ? thisMonthInsights.count / previousMonthInsights.count
      : 0;

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const [
          fetchedAllInsights,
          fetchedTodayInsights,
          fetchedThisMonthInsights,
          fetchedPreviousMonthInsights,
        ] = await Promise.all([
          client.getInsights(),
          client.getInsights({ time__day: currentDay }),
          client.getInsights({ time__month: currentMonth }),
          client.getInsights({ time__month: previousMonth }),
        ]);
        setAllInsights(fetchedAllInsights);
        setTodayInsights(fetchedTodayInsights);
        setThisMonthInsights(fetchedThisMonthInsights);
        setPreviousMonthInsights(fetchedPreviousMonthInsights);

        console.log("Insights are fetched");
      } catch (e) {}
    };

    fetchInsights();

    return () => {};
  }, []);

  return (
    <>
      <Row>
        <Col xl={4} sm={6}>
          <CounterWidget
            category="Insights"
            title={allInsights ? allInsights.count : "..."}
            period="All time"
            percentage={(monthIncrese * 100).toFixed(2)}
            icon={faChartPie}
            iconColor="shape-secondary"
          />
        </Col>
      </Row>
    </>
  );
}

export default Links;
