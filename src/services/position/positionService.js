import { http } from "@/api/axiosClient";

export const positionService = {
  // GET: api/Position/user/{userId}
  getByUserId: (userId) => {
    return http.get(`/position/user/${userId}`);
  },

  // GET: api/Position
  getAll: () => {
    return http.get("/position");
  },

  // GET: api/Position/available/{userId}
  getAvailable: (userId) => {
    return http.get(`/position/available/${userId}`);
  },

  // POST: api/Position/assign-list
  // DTO: AssignPositionListRequestDto { userId, positionIds }
  addPositions: (data) => {
    return http.post("/position/assign-list", data);
  },

  // DELETE: api/Position/remove-position
  // DTO: DeletePositionRequest { userId, positionId }
  removePosition: (payload) => {
    // Truyền trực tiếp ID lên URL, bỏ hoàn toàn { data: payload } và headers
    return http.delete(
      `/position/remove-position?userId=${payload.userId}&positionId=${payload.positionId}`,
    );
  },
};
