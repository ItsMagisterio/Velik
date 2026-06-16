import { Router, type IRouter } from "express";
import healthRouter from "./health";
import categoriesRouter from "./categories";
import productsRouter from "./products";
import reviewsRouter from "./reviews";
import cartRouter from "./cart";
import ordersRouter from "./orders";
import authRouter from "./auth";
import repairRouter from "./repair";
import promotionsRouter from "./promotions";
import statsRouter from "./stats";
import newsRouter from "./news";
import usersRouter from "./users";

const router: IRouter = Router();

router.use(healthRouter);
router.use(categoriesRouter);
router.use(productsRouter);
router.use(reviewsRouter);
router.use(cartRouter);
router.use(ordersRouter);
router.use(authRouter);
router.use(repairRouter);
router.use(promotionsRouter);
router.use(statsRouter);
router.use(newsRouter);
router.use(usersRouter);

export default router;
