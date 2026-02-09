import {
  Stack,
} from "@mui/material";
import { MainLayout } from "../components/MainLayout";
import PageLabel from "../components/PageLabel";
import DashboardStats from "../components/DashboardStats";
import AuditLogsSection from "../components/AuditLogsSection";

const DashboardPage = () => {
  return (
    <MainLayout>
      <PageLabel title="Dashboard" subTitle="Summary of your infrastructure." />
      <Stack gap={2}>
        <DashboardStats />
        <AuditLogsSection />
      </Stack>
    </MainLayout>
  );
};

export default DashboardPage;
